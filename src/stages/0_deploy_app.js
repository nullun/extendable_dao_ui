
import StageCard from "../components/StageCard";
import { CardActions, CardContent, Button, Typography } from "@mui/material";

export default function DeployApp({stage, setStage, setData}){


	return(
		<StageCard currStage={stage} triggerStage={0} title="Deploy DAO">
			<CardContent>
				<Typography>App ID: </Typography>
			</CardContent>
			<CardActions>
				<Button variant="contained" onClick={() => setStage(1)} disabled={stage !== 0}>Deploy DAO</Button>
			</CardActions>
		</StageCard>
	)
}