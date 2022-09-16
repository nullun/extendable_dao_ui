import { useState } from "react";
import { Typography, Box } from "@mui/material";
import Header from "./components/Header";
import { useSandboxData } from "./hooks/useSandbox";
import useWallets from "./hooks/useWallets";

import { Algodv2, ABIContract } from "algosdk";
import dao_abi from './contracts/dao_abi.json'

import DeployApp from "./stages/0_deploy_app";
import DAOToken from "./stages/1_dao_token";
import InitDAO from "./stages/2_init_dao";
import FakeASA from "./stages/3_fake_asa";
import ProposeFunctionality from "./stages/4_propose_func";
import Voting from "./stages/5_voting";
import Proposal from "./stages/6_proposal";
import Invoke from "./stages/7_invoke";

const contract = new ABIContract(dao_abi)

export default function App() {
	const [app, setApp] = useState({
		stage: 1,
		data: {}
	})

	// const { data: sandbox_conn } = useSandboxActive()
	const [sandbox] = useSandboxData()

	const {data: wallets} = useWallets()

	const algod = new Algodv2(sandbox.algod_token, "http://localhost", sandbox.algod_port)

	console.log(app)

	return (
		<main id="App">
			<Header />
			<Typography variant="h3" fontWeight={700} textAlign="center" mb={2}>Extendable DAO Demo</Typography>

			<Box display="flex" justifyContent="center">
				<DeployApp app={app} setApp={setApp} algod={algod} contract={contract} wallets={wallets} />
			</Box>
			<Box display="flex" gap={2} justifyContent="center">
				<DAOToken app={app} setApp={setApp} algod={algod} wallets={wallets} />
				<Box display="flex" flexDirection="column" gap={2}>
					<InitDAO app={app} setApp={setApp} algod={algod} contract={contract} wallets={wallets} />
					<FakeASA app={app} setApp={setApp} algod={algod} wallets={wallets} />
				</Box>
				<ProposeFunctionality app={app} setApp={setApp} algod={algod} contract={contract} wallets={wallets} />
			</Box>
			<Box display="flex" justifyContent="center" gap={2}>
				<Voting app={app} setApp={setApp} algod={algod} contract={contract} wallets={wallets} />
				<Proposal app={app} setApp={setApp} algod={algod} contract={contract} wallets={wallets} />
				<Invoke app={app} algod={algod} contract={contract} wallets={wallets} />
			</Box>
		</main>
	);
}
