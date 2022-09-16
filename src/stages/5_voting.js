import { useState } from "react";
import StageCard from "../components/StageCard";
import { CardActions, CardContent, TextField, Typography, Box } from "@mui/material";
import { LoadingButton } from '@mui/lab';
import { useQuery } from "@tanstack/react-query";
import { 
	makeAssetTransferTxnWithSuggestedParamsFromObject, 
	AtomicTransactionComposer, 
	makeBasicAccountTransactionSigner, 
	OnApplicationComplete
} from "algosdk";

export default function Voting({app, setApp, algod, contract, wallets}){
	const [amount, setAmount] = useState(1)

	const { isSuccess, isFetching: vote_fetching, isError: vote_error, refetch } = useQuery(['5', 'vote'], async () => {
			const sp = await algod.getTransactionParams().do()
			const composer = new AtomicTransactionComposer()
			const signer = makeBasicAccountTransactionSigner(wallets[1])

			// Voting Txn
			composer.addMethodCall({
				appID: app.data.appID,
				method: contract.getMethodByName("vote"),
				methodArgs: [
					app.data.proposalApp,
					{
						txn: makeAssetTransferTxnWithSuggestedParamsFromObject({
							from: app.data.voter,
							to: app.data.appAddress,
							amount: amount,
							assetIndex: app.data.daotokenID,
							suggestedParams: sp
						}),
						signer: signer
					},
					true,
				],
				onComplete: OnApplicationComplete.OptInOC,
				suggestedParams: sp,
				sender: app.data.voter,
				signer: signer
			})

			return await composer.execute(algod, 2)
	})

	const { isFetching: vote_ending, isError: end_error, refetch: end_vote } = useQuery(['5', 'end_vote'], async () => {
		const sp = await algod.getTransactionParams().do()
		const composer = new AtomicTransactionComposer()

		composer.addMethodCall({
			appID: app.data.appID,
			method: contract.getMethodByName("end_voting"),
			methodArgs: [app.data.proposalApp],
			sender: app.data.owner,
			suggestedParams: sp,
			signer: makeBasicAccountTransactionSigner(wallets[0])
		});

		return await composer.execute(algod, 2);

	}, {
		onSuccess: () => setApp(prev => ({...prev, stage: 6}))
	})

	return(
		<StageCard currStage={app.stage} triggerStage={5} title="Voting" error={(vote_error || end_error)}>
			<CardContent>
				<Typography>Voting for Proposal App: {'proposalApp' in app.data && app.data.proposalApp}</Typography>

				<Box mt={2}>
					<Typography>Enter Vote Amount</Typography>
					<TextField type="number" variant="standard" size="small" InputProps={{ inputProps: { max: 20, min: 1 }}} onChange={({target: {value}}) => value > 20 ? setAmount(20) : value <= 0 ? setAmount(1) : setAmount(parseInt(value))} value={amount} helperText="Up to 20 DAO Tokens" />
				</Box>
			</CardContent>
			<CardActions>
				<LoadingButton variant="contained" onClick={() => refetch()} loading={vote_fetching} disabled={app.stage !== 5 || isSuccess}>Vote</LoadingButton>
				<LoadingButton variant="contained" onClick={() => end_vote()} loading={vote_ending} disabled={app.stage !== 5 || !isSuccess || vote_fetching}>End Vote</LoadingButton>
			</CardActions>
		</StageCard>
	)
}