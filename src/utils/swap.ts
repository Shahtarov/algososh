export const swap = <T>(arr: { data: T }[], i: number, j: number) => {
	const temp = arr[i]["data"];
	arr[i]["data"] = arr[j]["data"];
	arr[j]["data"] = temp;
};
