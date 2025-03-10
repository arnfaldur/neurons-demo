export function inventoryPointValue(inventory: any) {
	return (
		inventory.water * 4 +
		inventory.food * 3 +
		inventory.medication * 2 +
		inventory.ammunition * 1
	);
}
