import { useState } from "react";
import StageCard from "../components/StageCard";
import { CardActions } from "@mui/material";
import { LoadingButton } from '@mui/lab';
import { useQuery } from "@tanstack/react-query";
import { AtomicTransactionComposer, makeBasicAccountTransactionSigner, makeAssetTransferTxnWithSuggestedParamsFromObject } from "algosdk";
import { Box } from "@mui/system";

export default function Invoke({app, algod, contract, wallets}){

	const [invoked, setInvoked] = useState(false)

	const { isFetching, isError, refetch } = useQuery(['7', 'invoke'], async () => {
			const sp = await algod.getTransactionParams().do()
			const composer = new AtomicTransactionComposer()
			const owner = makeBasicAccountTransactionSigner(wallets[0])
			
			if(!invoked){
				composer.addMethodCall({
					appID: app.data.appID,
					method: contract.getMethodByName("invoke"),
					methodArgs: [app.data.activatedAppID],
					sender: app.data.owner,
					signer: owner,
					suggestedParams: sp
				});
				// foreign Assets
				composer['transactions'][0]['txn']['appForeignAssets'][0] = app.data.asa1;
			} else {
				composer.addTransaction({
					txn: makeAssetTransferTxnWithSuggestedParamsFromObject({
						from: app.data.owner,
						to: app.data.appAddress,
						amount: 10000000,
						assetIndex: app.data.asa1,
						suggestedParams: sp
					}),
					signer: owner
				})
			}

			return await composer.execute(algod, 2)

	}, {
		onSuccess: () => setInvoked(true)
	})

	return(
		<StageCard currStage={app.stage} triggerStage={7} title="Invoke" error={isError}>
			<CardActions>
				<Box display="flex" flexDirection="column" gap={2} mt={2}>
					<LoadingButton variant="contained" onClick={() => refetch()} loading={isFetching} disabled={app.stage !== 7 || invoked}>Invoke</LoadingButton>		
					<LoadingButton variant="contained" onClick={() => refetch()} loading={isFetching} disabled={app.stage !== 7 || !invoked}>Send 10 FUSDC to DAO</LoadingButton>
				</Box>
			</CardActions>
		</StageCard>
	)
}