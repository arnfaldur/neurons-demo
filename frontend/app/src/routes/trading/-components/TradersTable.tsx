import {
	Button,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";
import { lightGreen } from "@mui/material/colors";

import { Survivor } from "../../../types";
import { InventorySmall } from "../../../components/inventory";

export function TradersTable({
	survivors,
	select,
	selected,
	forbidden,
}: {
	survivors: Survivor[];
	select: (s: number | null) => void;
	selected: number | null;
	forbidden: number | null;
}) {
	return (
		<>
			<TableContainer component={Paper} sx={{ mb: 1 }}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>ID</TableCell>
							<TableCell>Name</TableCell>
							<TableCell>Inventory</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{Object.values(survivors)
							.filter(
								(survivor) =>
									(!selected || selected === survivor.id) &&
									survivor.id !== forbidden,
							)
							.map((survivor) => (
								<TableRow
									key={survivor.id}
									hover={selected !== survivor.id}
									sx={{
										...(selected === survivor.id
											? {
													backgroundColor:
														lightGreen[400],
											  }
											: {
													cursor: "pointer",
											  }),
									}}
									onClick={() => select(survivor.id)}
								>
									<TableCell>{survivor.id}</TableCell>
									<TableCell>{survivor.name}</TableCell>
									<TableCell>
										<InventorySmall
											inventory={survivor.inventory}
										/>
									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</TableContainer>
			{selected && (
				<Button
					variant="contained"
					color="warning"
					onClick={() => select(null)}
				>
					Reset selection
				</Button>
			)}
		</>
	);
}
