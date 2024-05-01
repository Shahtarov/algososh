import { FormEvent, useEffect, useState, FC } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { RadioInput } from "../ui/radio-input/radio-input";
import { Button } from "../ui/button/button";
import { Direction } from "../../types/direction";
import { Column } from "../ui/column/column";
import { ElementStates } from "../../types/element-states";
import styles from "./sorting-page.module.css";
import { swap } from "../../utils/swap";

interface IArrayItem {
	data: number;
	state: ElementStates;
}

export const SortingPage: FC = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const generateRandomArray = (
		minLength: number = 3,
		maxLength: number = 17
	): number[] => {
		const length = Math.max(minLength, Math.floor(Math.random() * maxLength));
		return Array.from({ length }, () => Math.floor(Math.random() * 100));
	};

	const [animatedArray, setAnimatedArray] = useState<IArrayItem[]>(
		generateRandomArray().map((item) => ({
			data: item,
			state: ElementStates.Default
		}))
	);

	const [sortingOrder, setSortingOrder] = useState<string>("");
	const [sortingAlgorithm, setSortingAlgorithm] =
		useState<string>("selection");
	const [currentIndex, setCurrentIndex] = useState<number>(0);
	const [i, setI] = useState<number>(0);
	const [j, setJ] = useState<number>(0);

	const compare = (first: number, second: number) => {
		if (sortingOrder === "asc") {
			return first < second;
		} else if (sortingOrder === "desc") {
			return first > second;
		} else {
			console.error("Invalid sorting order:", sortingOrder);
		}
	};

	const handleClick = (type: string) => {
		if (["selection", "bubble"].includes(type)) {
			setSortingAlgorithm(type);
		} else if (["asc", "desc"].includes(type)) {
			if (sortingAlgorithm === "selection") {
				setI(0);
				setJ(1);
			} else if (sortingAlgorithm === "bubble") {
				setI(0);
				setJ(0);
			}
			setAnimatedArray(
				animatedArray.map((item) => ({
					data: item.data,
					state: ElementStates.Default
				}))
			);
			setSortingOrder(type);
			setIsLoading(true);
		} else if (type === "newArray") {
			setIsLoading(false);
			setAnimatedArray(
				generateRandomArray().map((item) => ({
					data: item,
					state: ElementStates.Default
				}))
			);
		} else {
			console.error("Invalid action type:", type);
		}
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		let selectedAlgorithm: string | null = null;
		const radios = document.getElementsByName("sortType");
		for (let i = 0; i < radios.length; i++) {
			const radioBtn = radios[i] as HTMLInputElement;
			if (radioBtn.checked) {
				selectedAlgorithm = radioBtn.value;
			}
		}
		setSortingAlgorithm(selectedAlgorithm ?? "selection");
	};

	const bubbleSortStep = (array: IArrayItem[]) => {
		if (j > 0) {
			array[j - 1].state = ElementStates.Default;
			array[j].state = ElementStates.Default;
		}

		if (compare(array[j + 1].data, array[j].data)) {
			swap<number>(array, j, j + 1);
		}
		array[j].state = ElementStates.Changing;
		array[j + 1].state = ElementStates.Changing;

		if (i + 1 === array.length) {
			array[j].state = ElementStates.Modified;
			array[j + 1].state = ElementStates.Modified;
			setIsLoading(false);
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

	const selectionSortStep = (array: IArrayItem[]) => {
		array[j - 1].state = ElementStates.Default;
		array[i].state = ElementStates.Changing;

		if (j < array.length) {
			array[j].state = ElementStates.Changing;

			if (j === i + 1 || compare(array[j].data, array[currentIndex].data)) {
				setCurrentIndex(j);
			}
		}

		if (i + 1 === array.length) {
			array[i].state = ElementStates.Modified;
			setIsLoading(false);
			setI(0);
			setJ(1);
		} else if (j > array.length - 1) {
			array[i].state = ElementStates.Modified;
			if (compare(array[currentIndex].data, array[i].data)) {
				swap(array, currentIndex, i);
			}

			setCurrentIndex(i + 1);
			setJ(i + 2);
			setI(i + 1);
		} else {
			setJ(j + 1);
		}
	};

	useEffect(() => {
		const interval = setInterval(() => {
			if (isLoading) {
				if (true) {
					const arrayCopy: IArrayItem[] = animatedArray.slice();
					if (sortingAlgorithm === "bubble") {
						bubbleSortStep(arrayCopy);
					} else if (sortingAlgorithm === "selection") {
						selectionSortStep(arrayCopy);
					}
					setAnimatedArray(arrayCopy);
				}
			} else {
				setIsLoading(false);
				if (sortingAlgorithm === "selection") {
					setI(0);
					setJ(1);
				} else if (sortingAlgorithm === "bubble") {
					setI(0);
					setJ(0);
				}
			}
		}, 200);

		return () => {
			clearInterval(interval);
		};
	}, [isLoading, animatedArray, i, j]);

	return (
		<SolutionLayout title="Сортировка массива">
			<form className={styles.form} action="" onSubmit={handleSubmit}>
				<div className={styles.switcher}>
					<RadioInput
						label={"Выбор"}
						name={"sortType"}
						value={"selection"}
						checked={sortingAlgorithm === "selection"}
						onChange={() => {
							handleClick("selection");
						}}
						disabled={isLoading}
					/>
					<RadioInput
						label={"Пузырёк"}
						name={"sortType"}
						value={"bubble"}
						checked={sortingAlgorithm === "bubble"}
						onChange={() => {
							handleClick("bubble");
						}}
						disabled={isLoading}
					/>
				</div>
				<div className={styles.directions}>
					<Button
						id={"asc"}
						type="submit"
						text={"По возрастанию"}
						sorting={Direction.Ascending}
						name={"asc"}
						value={"asc"}
						isLoader={isLoading && sortingOrder === "asc"}
						disabled={isLoading}
						onClick={() => handleClick("asc")}
					/>
					<Button
						id={"desc"}
						type="submit"
						text={"По убыванию"}
						sorting={Direction.Descending}
						name={"desc"}
						value={"desc"}
						isLoader={isLoading && sortingOrder === "desc"}
						disabled={isLoading}
						onClick={() => handleClick("desc")}
					/>
				</div>
				<Button
					type="submit"
					text={"Новый массив"}
					value={"newArray"}
					onClick={() => handleClick("newArray")}
					disabled={isLoading}
				/>
			</form>
			<div className={styles.animation}>
				{animatedArray &&
					animatedArray.map((item, index) => {
						return (
							<Column
								key={index}
								index={item["data"]}
								state={item["state"]}
							></Column>
						);
					})}
			</div>
		</SolutionLayout>
	);
};
