import { ChangeEvent, useEffect, useState, FC } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/element-states";
import { ArrowIcon } from "../ui/icons/arrow-icon";
import styles from "./list-page.module.css";
import { LinkedList } from "../../utils/linked-list";

export const randomArr = (
	minLen: number = 3,
	maxLen: number = 17
): number[] => {
	const length = Math.max(minLen, Math.floor(Math.random() * maxLen));
	return Array.from({ length: length }, () => Math.floor(Math.random() * 100));
};

interface ILinkedLIstItem {
	data: string;
	state: ElementStates;
	smallUpperData: string | null;
	smallLowerData: string | null;
}

const getArrayToAnimate = (list: LinkedList<ILinkedLIstItem>) => {
	const listArray = list.toArray();
	return listArray.map((item, index) => {
		return (
			<div key={index} className={styles.list_item} data-testid="result">
				<Circle
					index={index}
					letter={item["data"]}
					state={item["state"]}
					head={
						item["smallUpperData"] !== null ? (
							<Circle
								letter={item["smallUpperData"]}
								state={ElementStates.Changing}
								isSmall={true}
							></Circle>
						) : index === 0 ? (
							"head"
						) : null
					}
					tail={
						item["smallLowerData"] !== null ? (
							<Circle
								letter={item["smallLowerData"]}
								state={ElementStates.Changing}
								isSmall={true}
							></Circle>
						) : index === listArray.length - 1 ? (
							"tail"
						) : null
					}
				></Circle>
				{index !== listArray.length - 1 && (
					<div className={styles.arrow}>
						<ArrowIcon></ArrowIcon>
					</div>
				)}
			</div>
		);
	});
};

export const ListPage: FC = () => {
	const [isLoader, setIsLoder] = useState(false);
	const [action, setAction] = useState<string | null>("");
	const [input, setInput] = useState("");
	const [inputIdx, setInputIdx] = useState("");
	const [direction, setDirection] = useState("");
	const [i, setI] = useState(0);
	const [list, setList] = useState<LinkedList<ILinkedLIstItem>>(
		new LinkedList<ILinkedLIstItem>(
			randomArr(4, 6).map((item: number): ILinkedLIstItem => {
				return {
					data: item.toString(),
					smallUpperData: null,
					smallLowerData: null,
					state: ElementStates.Default
				};
			})
		)
	);

	const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
		setInput(e.target.value);
	};

	const onChangeInputIdx = (e: ChangeEvent<HTMLInputElement>) => {
		setInputIdx(e.target.value);
	};

	const onClkickPush = (type: string) => {
		if (type === "index" && Number(inputIdx) === 0) {
			type = "front";
		} else {
			if (type === "index" && Number(inputIdx) === list.size()) {
				type = "back";
			}
		}

		setDirection(type);
		(document.getElementById("inputValue") as HTMLInputElement).value = "";
		const newList = new LinkedList<ILinkedLIstItem>(list.toArray());

		if (type === "back" && newList.tail !== null) {
			newList.tail.value.smallLowerData = input;
		} else if (
			(type === "front" || type === "index") &&
			newList.head !== null
		) {
			newList.head.value.smallUpperData = input;
		} else {
			console.log("Error type");
		}

		setList(new LinkedList<ILinkedLIstItem>(newList.toArray()));
		setIsLoder(true);
		setAction("push");
		setInput("");
		setI(0);
	};

	const onClkickPop = (type: string) => {
		setDirection(type);
		if (type !== "index") {
			const newList = new LinkedList<ILinkedLIstItem>(list.toArray());

			if (type === "back" && newList.tail !== null) {
				newList.tail.value.smallLowerData = newList.tail.value.data;
				newList.tail.value.data = "";
			} else if (
				(type === "front" || type === "index") &&
				newList.head !== null
			) {
				newList.head.value.smallLowerData = newList.head.value.data;
				newList.head.value.data = "";
			} else {
				console.log("Error type");
			}
			setList(new LinkedList<ILinkedLIstItem>(newList.toArray()));
		} else {
			setI(0);
		}
		setIsLoder(true);
		setAction("pop");
	};

	useEffect(() => {
		const interval = setInterval(() => {
			if (isLoader) {
				if (action === "push" && direction !== "index") {
					const newList = new LinkedList<ILinkedLIstItem>(list.toArray());

					let node: ILinkedLIstItem | null = null;
					if (direction === "back" && newList.tail !== null) {
						node = newList.tail.value;
					} else if (direction === "front" && newList.head !== null) {
						node = newList.head.value;
					} else {
						return;
					}

					const newItem: ILinkedLIstItem = {
						data:
							node[
								direction === "back"
									? "smallLowerData"
									: "smallUpperData"
							] ?? "",
						state: ElementStates.Modified,
						smallUpperData: null,
						smallLowerData: null
					};
					node[
						direction === "back" ? "smallLowerData" : "smallUpperData"
					] = null;
					setAction("push2");

					if (direction === "front") {
						newList.prepend(newItem);
					} else {
						newList.append(newItem);
					}
					setList(new LinkedList<ILinkedLIstItem>(newList.toArray()));
				} else if (action === "push" && direction === "index") {
					const array = new LinkedList<ILinkedLIstItem>(
						list.toArray()
					).toArray();

					array[i]["state"] = ElementStates.Changing;
					array[i + 1]["smallUpperData"] = array[i]["smallUpperData"];
					array[i]["smallUpperData"] = null;

					if (i + 1 === Number(inputIdx)) {
						setAction("push2");
					}
					setI(i + 1);
					setList(new LinkedList<ILinkedLIstItem>(array));
				} else if (action === "push2") {
					if (direction === "index") {
						const idx = Number(inputIdx);
						let newList = new LinkedList<ILinkedLIstItem>(list.toArray());
						const value = newList.toArray()[i]["smallUpperData"];
						newList.addByIndex(idx, {
							data: value ?? "",
							state: ElementStates.Modified,
							smallUpperData: null,
							smallLowerData: null
						});
						const array = newList.toArray().map((item, index) => {
							return {
								...item,
								state:
									index === idx
										? ElementStates.Modified
										: ElementStates.Default,
								smallUpperData: null
							};
						});
						setDirection("");
						setList(new LinkedList<ILinkedLIstItem>(array));
					} else {
						const newList = new LinkedList<ILinkedLIstItem>(
							list.toArray()
						);
						setList(
							new LinkedList<ILinkedLIstItem>(
								newList.toArray().map((item) => {
									return { ...item, state: ElementStates.Default };
								})
							)
						);
						setAction(null);
					}
				} else if (action === "pop" && direction !== "index") {
					setAction(null);
					const newList = new LinkedList<ILinkedLIstItem>(list.toArray());
					if (direction === "front") {
						newList.deleteHead();
					} else {
						newList.deleteTail();
					}
					setList(new LinkedList<ILinkedLIstItem>(newList.toArray()));
				} else if (action === "pop" && direction === "index") {
					const array = new LinkedList<ILinkedLIstItem>(
						list.toArray()
					).toArray();
					array[i]["state"] = ElementStates.Changing;

					if (i === Number(inputIdx)) {
						setAction("pop2");
					} else {
						setI(i + 1);
					}
					setList(new LinkedList<ILinkedLIstItem>(array));
				} else if (action === "pop2" && direction === "index") {
					setAction("pop3");
					const array = new LinkedList<ILinkedLIstItem>(
						list.toArray()
					).toArray();
					const value = array[i]["data"];
					array[i]["smallLowerData"] = value;
					array[i]["state"] = ElementStates.Default;
					array[i]["data"] = "";
					setList(new LinkedList<ILinkedLIstItem>(array));
				} else if (action === "pop3" && direction === "index") {
					setAction(null);
					setI(0);
					const idx = Number(inputIdx);
					const newList = new LinkedList<ILinkedLIstItem>(list.toArray());
					newList.deleteByIndex(idx);
					setList(
						new LinkedList<ILinkedLIstItem>(
							newList.toArray().map((item) => {
								return { ...item, state: ElementStates.Default };
							})
						)
					);
				}

				if (action === null) {
					setIsLoder(false);
				}
			}
		}, 500);

		return () => {
			clearInterval(interval);
		};
	}, [isLoader, i, list]);

	return (
		<SolutionLayout title="Связный список">
			<div className={styles.container}>
				<div className={styles.upButtons}>
					<div>
						<Input
							id={"inputValue"}
							maxLength={4}
							isLimitText={true}
							placeholder={"Введите значение"}
							onChange={onChangeInput}
							disabled={isLoader}
							value={input}
							data-testid="input"
						></Input>
					</div>
					<Button
						type="button"
						text={"Добавить в head"}
						onClick={() => onClkickPush("front")}
						isLoader={
							isLoader && action === "push" && direction === "front"
						}
						disabled={
							(isLoader && action !== "push" && direction !== "front") ||
							!input
						}
						data-testid="add-to-head"
					></Button>
					<Button
						type="button"
						text={"Добавить в tail"}
						onClick={() => onClkickPush("back")}
						isLoader={
							isLoader && action === "push" && direction === "back"
						}
						disabled={
							(isLoader && action !== "push" && direction !== "back") ||
							!input
						}
						data-testid="add-to-tail"
					></Button>
					<Button
						type="button"
						text={"Удалить из head"}
						onClick={() => onClkickPop("front")}
						isLoader={
							isLoader && action === "pop" && direction === "front"
						}
						disabled={isLoader || !list.size()}
						data-testid="delete-from-head"
					></Button>
					<Button
						type="button"
						text={"Удалить из tail"}
						onClick={() => onClkickPop("back")}
						isLoader={
							isLoader && action === "pop" && direction === "back"
						}
						disabled={isLoader || !list.size()}
						data-testid="delete-from-tail"
					></Button>
				</div>
				<div className={styles.downButtons}>
					<div>
						<Input
							id={"inputIdx"}
							type={"number"}
							placeholder={"Введите индекс"}
							onChange={onChangeInputIdx}
							style={{ minWidth: "20%" }}
							disabled={isLoader}
							value={inputIdx}
							data-testid="index"
						></Input>
					</div>

					<Button
						type="button"
						text={"Добавить по индексу"}
						onClick={() => onClkickPush("index")}
						isLoader={
							isLoader && action === "push" && direction === "index"
						}
						disabled={
							isLoader ||
							!inputIdx ||
							!input ||
							Number(inputIdx) < 0 ||
							Number(inputIdx) > list.size() - 1
						}
						style={{ minWidth: "35%" }}
						data-testid="add-by-index"
					></Button>
					<Button
						type="button"
						text={"Удалить по индексу"}
						onClick={() => onClkickPop("index")}
						isLoader={
							isLoader && action === "pop" && direction === "index"
						}
						disabled={
							isLoader ||
							!inputIdx ||
							Number(inputIdx) < 0 ||
							Number(inputIdx) >= list.size()
						}
						style={{ minWidth: "35%" }}
						data-testid="delete-by-index"
					></Button>
				</div>
			</div>
			<div className={styles.animation}>{getArrayToAnimate(list)}</div>
		</SolutionLayout>
	);
};
