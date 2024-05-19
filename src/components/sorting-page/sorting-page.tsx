import { FormEvent, useEffect, useState, FC } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { RadioInput } from "../ui/radio-input/radio-input";
import { Button } from "../ui/button/button";
import { Direction } from "../../types/direction";
import { Column } from "../ui/column/column";
import { ElementStates } from "../../types/element-states";
import styles from "./sorting-page.module.css";
import { swap } from "../../utils/swap";

const randomArr = (minLen: number = 3, maxLen: number = 17): number[] => {
	const length = Math.max(minLen, Math.floor(Math.random() * maxLen));
	return Array.from({ length: length }, () => Math.floor(Math.random() * 100));
};

interface IItem {
	data: number;
	state: ElementStates;
}

const cmp = (sortType: string, first: number, second: number): boolean => {
	if (sortType === "asc") {
		return first < second;
	} else if (sortType === "desc") {
		return first > second;
	} else {
		console.log("cmp error sortType", sortType);
		return false;
	}
};

export const sortAlgo = (
	array: IItem[],
	algoType: string,
	sortType: string
): IItem[] => {
	const newArray = array.slice();
	if (algoType === "selection") {
		for (let i = 0; i < newArray.length; i++) {
			let idx = i;
			for (let j = i + 1; j < newArray.length; j++) {
				if (cmp(sortType, newArray[j].data, newArray[idx].data)) {
					idx = j;
				}
			}
			swap(newArray, i, idx);
		}
	} else if (algoType === "bubble") {
		for (let i = 0; i < newArray.length; i++) {
			for (let j = 0; j < newArray.length - i - 1; j++) {
				if (cmp(sortType, newArray[j + 1].data, newArray[j].data)) {
					swap(newArray, j, j + 1);
				}
			}
		}
	}
	return newArray;
};

export const SortingPage: FC = () => {
	const [isLoader, setIsLoader] = useState<boolean>(false);
	const [arrayToAnimate, setArrayToAnimate] = useState<IItem[]>(
		randomArr().map((item) => {
			return {
				data: item,
				state: ElementStates.Default
			};
		})
	);
	const [answer, setAnswer] = useState<IItem[]>(arrayToAnimate);

	const [sortType, setSortType] = useState<string>(""); // asc / desc
	const [sortAlgoType, setSortAlgoType] = useState<string>("selection"); // selection / bubble
	const [sortIndex, setSortIndex] = useState<number>(0);
	const [i, setI] = useState<number>(0);
	const [j, setJ] = useState<number>(0);

	const onClick = (type: string) => {
		if (["selection", "bubble"].includes(type)) {
			setSortAlgoType(type);
		} else if (["asc", "desc"].includes(type)) {
			if (sortAlgoType === "selection") {
				setI(0);
				setJ(1);
			} else if (sortAlgoType === "bubble") {
				setI(0);
				setJ(0);
			}
			setArrayToAnimate(
				arrayToAnimate.map((item) => {
					return {
						data: item.data,
						state: ElementStates.Default
					};
				})
			);
			setSortType(type);
			setIsLoader(true);
			setAnswer(sortAlgo(arrayToAnimate, sortAlgoType, type));
		} else if (type === "newArray") {
			setIsLoader(false);
			setArrayToAnimate(
				randomArr().map((item) => {
					return {
						data: item,
						state: ElementStates.Default
					};
				})
			);
		} else {
			console.log("Error onClick", type);
		}
	};

	const onSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		let sortAlgo: string | null = null;
		const radios = document.getElementsByName("sortType");
		for (let i = 0; i < radios.length; i++) {
			const btn = radios[i] as HTMLInputElement;
			if (btn.checked) {
				sortAlgo = btn.value;
			}
		}
		setSortAlgoType(sortAlgo ?? "selection");
	};

	const bubbleSortAnimationStep = (array: IItem[]) => {
		if (j > 0) {
			array[j - 1].state = ElementStates.Default;
			array[j].state = ElementStates.Default;
		}

		if (cmp(sortType, array[j + 1].data, array[j].data)) {
			swap(array, j, j + 1);
		}
		array[j].state = ElementStates.Changing;
		array[j + 1].state = ElementStates.Changing;

		if (i + 1 === array.length) {
			array[j].state = ElementStates.Modified;
			array[j + 1].state = ElementStates.Modified;
			setIsLoader(false);
			setI(0);
			setJ(0);
		} else if (j + 1 === array.length - i - 1) {
			array[j].state = ElementStates.Default;
			array[j + 1].state = ElementStates.Modified;
			setJ(0);
			setI(i + 1);
		} else {
			setJ(j + 1);
		}
	};

	const selectionSortAnimationStep = (array: IItem[]) => {
		if (j > 0) {
			array[j - 1].state = ElementStates.Default;
		}
		array[i].state = ElementStates.Changing;

		if (j < array.length) {
			array[j].state = ElementStates.Changing;

			if (
				j === i + 1 ||
				cmp(sortType, array[j].data, array[sortIndex].data)
			) {
				setSortIndex(j);
			}
		}

		if (i + 1 === array.length) {
			array[i].state = ElementStates.Modified;
			setIsLoader(false);
			setI(0);
			setJ(1);
		} else if (j > array.length - 1) {
			array[i].state = ElementStates.Modified;
			if (cmp(sortType, array[sortIndex].data, array[i].data)) {
				swap(array, sortIndex, i);
			}
			setSortIndex(i + 1);
			setJ(i + 2);
			setI(i + 1);
		} else {
			setJ(j + 1);
		}
	};

	useEffect(() => {
		const interval = setInterval(() => {
			if (isLoader) {
				const array: IItem[] = arrayToAnimate.slice();
				if (sortAlgoType === "bubble") {
					bubbleSortAnimationStep(array);
				} else if (sortAlgoType === "selection") {
					selectionSortAnimationStep(array);
				}
				setArrayToAnimate(array);
			} else {
				setIsLoader(false);
				if (sortAlgoType === "selection") {
					setI(0);
					setJ(1);
				} else if (sortAlgoType === "bubble") {
					setI(0);
					setJ(0);
				}
			}
		}, 200);

		return () => {
			clearInterval(interval);
		};
	}, [isLoader, arrayToAnimate, i, j, sortAlgoType, answer, sortType]);

	return (
		<SolutionLayout title="Сортировка массива">
			<form className={styles.form} onSubmit={onSubmit}>
				<div className={styles.switcher}>
					<RadioInput
						label={"Выбор"}
						name={"sortType"}
						value={"selection"}
						checked={sortAlgoType === "selection"}
						onChange={() => {
							onClick("selection");
						}}
						disabled={isLoader}
					></RadioInput>
					<RadioInput
						label={"Пузырёк"}
						name={"sortType"}
						value={"bubble"}
						checked={sortAlgoType === "bubble"}
						onChange={() => {
							onClick("bubble");
						}}
						disabled={isLoader}
					></RadioInput>
				</div>
				<div className={styles.directions}>
					<div
						onClick={() => {
							onClick("asc");
						}}
					>
						<Button
							id={"asc"}
							type="submit"
							text={"По возрастанию"}
							sorting={Direction.Ascending}
							name={"asc"}
							value={"asc"}
							isLoader={isLoader && sortType === "asc"}
							disabled={isLoader}
						></Button>
					</div>
					<div
						onClick={() => {
							onClick("desc");
						}}
					>
						<Button
							id={"desc"}
							type="submit"
							text={"По убыванию"}
							sorting={Direction.Descending}
							name={"desc"}
							value={"desc"}
							isLoader={isLoader && sortType === "desc"}
							disabled={isLoader}
						></Button>
					</div>
				</div>
				<Button
					type="submit"
					text={"Новый массив"}
					value={"newArray"}
					onClick={() => {
						onClick("newArray");
					}}
					disabled={isLoader}
				></Button>
			</form>
			<div className={styles.animation}>
				{arrayToAnimate &&
					arrayToAnimate.map((item, index) => {
						return (
							<Column
								key={index}
								index={item.data}
								state={item.state}
							></Column>
						);
					})}
			</div>
		</SolutionLayout>
	);
};
