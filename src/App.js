import { useState } from "react";
import { Typography } from "@mui/material";
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
		stage: 0,
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
			<Typography variant="h3" textAlign="center" mb={2}>Extendable DAO Demo</Typography>

			<section style={{display: 'flex', gap: '2rem', flexWrap: 'wrap'}}>
				<DeployApp app={app} setApp={setApp} algod={algod} contract={contract} wallets={wallets} />
				<DAOToken app={app} setApp={setApp} algod={algod} wallets={wallets} />
				<InitDAO app={app} setApp={setApp} algod={algod} contract={contract} wallets={wallets} />
				<FakeASA app={app} setApp={setApp} algod={algod} wallets={wallets} />
				<ProposeFunctionality app={app} setApp={setApp} algod={algod} contract={contract} wallets={wallets} />
				<Voting app={app} setApp={setApp} algod={algod} contract={contract} wallets={wallets} />
				<Proposal app={app} setApp={setApp} algod={algod} contract={contract} wallets={wallets} />
				<Invoke app={app} algod={algod} contract={contract} wallets={wallets} />
			</section>
		</main>
	);
}
