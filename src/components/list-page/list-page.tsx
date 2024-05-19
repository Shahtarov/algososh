import { ChangeEvent, useEffect, useState, FC } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/element-states";
import { ArrowIcon } from "../ui/icons/arrow-icon";
import { LinkedList } from "../../utils/linked-list";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import styles from "./list-page.module.css";

export const randomArr = (
	minLen: number = 3,
	maxLen: number = 17
): number[] => {
	const length = Math.max(minLen, Math.floor(Math.random() * maxLen));
	return Array.from({ length: length }, () => Math.floor(Math.random() * 100));
};

interface ILinkedItem {
	data: string;
	state: ElementStates;
	smallUpperData: string | null;
	smallLowerData: string | null;
}

const getArrayToAnimate = (list: LinkedList<ILinkedItem>) => {
	const listArray = list.toArray();
	return listArray.map((item, index) => {
		return (
			<li key={index} className={styles.list_item}>
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
			</li>
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
	const [list, setList] = useState<LinkedList<ILinkedItem>>(
		new LinkedList<ILinkedItem>(
			randomArr(4, 6).map((item: number): ILinkedItem => {
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
			if (type === "index" && Number(inputIdx) === list.size) {
				type = "back";
			}
		}

		setDirection(type);
		(document.getElementById("inputValue") as HTMLInputElement).value = "";
		const newList = new LinkedList<ILinkedItem>(list.toArray());

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

		setList(new LinkedList<ILinkedItem>(newList.toArray()));
		setIsLoder(true);
		setAction("push");
		setInput("");
		setI(0);
	};

	const onClkickPop = (type: string) => {
		setDirection(type);
		if (type !== "index") {
			const newList = new LinkedList<ILinkedItem>(list.toArray());

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
			setList(new LinkedList<ILinkedItem>(newList.toArray()));
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
					const newList = new LinkedList<ILinkedItem>(list.toArray());

					let node: ILinkedItem | null = null;
					if (direction === "back" && newList.tail !== null) {
						node = newList.tail.value;
					} else if (direction === "front" && newList.head !== null) {
						node = newList.head.value;
					} else {
						return;
					}

					const newItem: ILinkedItem = {
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
					setList(new LinkedList<ILinkedItem>(newList.toArray()));
				} else if (action === "push" && direction === "index") {
					const array = new LinkedList<ILinkedItem>(
						list.toArray()
					).toArray();

					array[i]["state"] = ElementStates.Changing;
					array[i + 1]["smallUpperData"] = array[i]["smallUpperData"];
					array[i]["smallUpperData"] = null;

					if (i + 1 === Number(inputIdx)) {
						setAction("push2");
					}
					setI(i + 1);
					setList(new LinkedList<ILinkedItem>(array));
				} else if (action === "push2") {
					if (direction === "index") {
						const idx = Number(inputIdx);
						let newList = new LinkedList<ILinkedItem>(list.toArray());
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
						setList(new LinkedList<ILinkedItem>(array));
					} else {
						const newList = new LinkedList<ILinkedItem>(list.toArray());
						setList(
							new LinkedList<ILinkedItem>(
								newList.toArray().map((item) => {
									return { ...item, state: ElementStates.Default };
								})
							)
						);
						setAction(null);
					}
				} else if (action === "pop" && direction !== "index") {
					setAction(null);
					const newList = new LinkedList<ILinkedItem>(list.toArray());
					if (direction === "front") {
						newList.deleteHead();
					} else {
						newList.deleteTail();
					}
					setList(new LinkedList<ILinkedItem>(newList.toArray()));
				} else if (action === "pop" && direction === "index") {
					const array = new LinkedList<ILinkedItem>(
						list.toArray()
					).toArray();
					array[i]["state"] = ElementStates.Changing;

					if (i === Number(inputIdx)) {
						setAction("pop2");
					} else {
						setI(i + 1);
					}
					setList(new LinkedList<ILinkedItem>(array));
				} else if (action === "pop2" && direction === "index") {
					setAction("pop3");
					const array = new LinkedList<ILinkedItem>(
						list.toArray()
					).toArray();
					const value = array[i]["data"];
					array[i]["smallLowerData"] = value;
					array[i]["state"] = ElementStates.Default;
					array[i]["data"] = "";
					setList(new LinkedList<ILinkedItem>(array));
				} else if (action === "pop3" && direction === "index") {
					setAction(null);
					setI(0);
					const idx = Number(inputIdx);
					const newList = new LinkedList<ILinkedItem>(list.toArray());
					newList.deleteByIndex(idx);
					setList(
						new LinkedList<ILinkedItem>(
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
		}, SHORT_DELAY_IN_MS);

		return () => {
			clearInterval(interval);
		};
	}, [isLoader, i, list, action, direction, inputIdx]);

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
							name="inputValue"
							value={input}
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
					></Button>
					<Button
						type="button"
						text={"Удалить из head"}
						onClick={() => onClkickPop("front")}
						isLoader={
							isLoader && action === "pop" && direction === "front"
						}
						disabled={isLoader || !list.size}
					></Button>
					<Button
						type="button"
						text={"Удалить из tail"}
						onClick={() => onClkickPop("back")}
						isLoader={
							isLoader && action === "pop" && direction === "back"
						}
						disabled={isLoader || !list.size}
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
							name="inputIdx"
							value={inputIdx}
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
							(isLoader && action !== "push" && direction === "index") ||
							!inputIdx ||
							!input ||
							!Number(input) ||
							Number(inputIdx) < 0 ||
							Number(inputIdx) > list.size
						}
						style={{ minWidth: "35%" }}
					></Button>
					<Button
						type="button"
						text={"Удалить по индексу"}
						onClick={() => onClkickPop("index")}
						isLoader={
							isLoader && action === "pop" && direction === "index"
						}
						disabled={
							(isLoader && action !== "pop" && direction === "index") ||
							!inputIdx ||
							!Number(inputIdx) ||
							Number(inputIdx) < 0 ||
							Number(inputIdx) >= list.size
						}
						style={{ minWidth: "35%" }}
					></Button>
				</div>
			</div>
			<ul className={styles.animation}>{getArrayToAnimate(list)}</ul>
		</SolutionLayout>
	);
};
