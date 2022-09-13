import { useState } from "react";
import { Typography, CardActions, CardContent, Button, Stepper, Step, StepLabel } from "@mui/material";
import Header from "./components/Header";
import StageCard from "./components/StageCard";

import DeployApp from "./stages/0_deploy_app";

// Stages
// 0: Nothing
// 1: App is Deployed


export default function App() {
	const [stage, setStage] = useState(0);
	const [data, setData] = useState({});

	// const { data: sandbox_conn } = useSandboxActive()

	return (
		<main id="App">
			<Header />
			<Typography variant="h3" textAlign="center" mb={2}>Extendable DAO Demo</Typography>

			<section style={{display: 'flex', gap: '2rem', flexWrap: 'wrap'}}>
				<DeployApp stage={stage} setStage={setStage} setData={setData} />

				<StageCard currStage={stage} triggerStage={1} title="Create DAO Token">
					<CardContent>
						<Stepper activeStep={4} orientation="vertical">
							<Step><StepLabel>Creating DAO Token</StepLabel></Step>
							<Step><StepLabel>Opting in Voter + Deployer Acc</StepLabel></Step>
							<Step><StepLabel>Sending Assets</StepLabel></Step>
							<Step><StepLabel>Create Dummy ASAs</StepLabel></Step>
						</Stepper>
					</CardContent>
					<CardActions>
						<Button variant="contained" onClick={() => setStage(2)} disabled={stage !== 1}>Opt In</Button>
					</CardActions>
				</StageCard>



				<StageCard currStage={stage} triggerStage={2} title="Fund DAO Contract">
					<CardActions>
						<Button variant="contained" onClick={() => setStage(3)} disabled={stage !== 2}>Fund Contract</Button>
					</CardActions>
				</StageCard>

				<StageCard currStage={stage} triggerStage={3} title="Initialize DAO">
					<CardContent>
						<Stepper activeStep={-1} orientation="vertical">
							<Step><StepLabel>Initialize DAO w/ Deployer</StepLabel></Step>
							<Step><StepLabel>Opting in DAO Token</StepLabel></Step>
						</Stepper>
					</CardContent>
					<CardActions>
						<Button variant="contained" onClick={() => setStage(3)} disabled={stage !== 3}>Initialize Contract</Button>
					</CardActions>
				</StageCard>

				<StageCard currStage={stage} triggerStage={4} title="Propose Functionality">
					<CardContent>
						<Stepper activeStep={-1} orientation="vertical">
							<Step><StepLabel>Deploy Functionalityr</StepLabel></Step>
							<Step><StepLabel>Propose Functionality</StepLabel></Step>
						</Stepper>
					</CardContent>
				</StageCard>

				<StageCard currStage={stage} triggerStage={4} title="Vote">
					<CardActions>
						<Button variant="contained" onClick={() => setStage(3)} disabled={stage !== 3}>Vote</Button>
						<Button variant="contained" onClick={() => setStage(3)} disabled={stage !== 3}>Reclaim</Button>
						<Button variant="contained" onClick={() => setStage(3)} disabled={stage !== 3}>End Voting</Button>
					</CardActions>
				</StageCard>

				<StageCard currStage={stage} triggerStage={4} title="Vote Ended">
					<CardActions>
						<Button variant="contained" onClick={() => setStage(3)} disabled={stage !== 3}>Active</Button>
					</CardActions>
				</StageCard>
				<StageCard currStage={stage} triggerStage={4} title="Invoke Functionality">
					<CardActions>
						<Button variant="contained" onClick={() => setStage(3)} disabled={stage !== 3}>Invoke</Button>
					</CardActions>
				</StageCard>
				<StageCard currStage={stage} triggerStage={4} title="DAO Opted-In ASAs">
					{/* <CardActions>
						<Button variant="contained" onClick={() => setStage(3)} disabled={stage !== 3}>Invoke</Button>
					</CardActions> */}
				</StageCard>
			</section>
		</main>
	);
}
