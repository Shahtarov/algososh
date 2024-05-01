import { useState, FormEvent, SyntheticEvent, useEffect, FC } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import styles from "./queue-page.module.css";
import { Button } from "../ui/button/button";
import { Input } from "../ui/input/input";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/element-states";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { Queue } from "../../utils/queue";

interface IQueueItem {
	data: string;
	state: ElementStates;
}

const delay = async () => {
	await new Promise((resolve) => setTimeout(resolve, SHORT_DELAY_IN_MS));
};

export const QueuePage: FC = () => {
	const [loader, setLoader] = useState(false);
	const [array, setArray] = useState<IQueueItem[]>([]);
	const [queue] = useState(new Queue<IQueueItem>(7));
	const [activeButton, setActiveButton] = useState<string | null>(null);
	const [inputValue, setInputValue] = useState("");

	useEffect(() => {
		setArray([...queue.elements()]);
	}, [queue]);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoader(true);
		setActiveButton("add");
		queue.enqueue({
			data: inputValue,
			state: ElementStates.Changing
		});
		setArray([...queue.elements()]);
		setInputValue("");
		await delay();
		if (queue.tail > 0) {
			queue.elements()[queue.tail - 1]!.state = ElementStates.Default;
		}
		setActiveButton(null);
		setLoader(false);
	};

	const handleRemove = async (e: SyntheticEvent) => {
		e.preventDefault();
		setLoader(true);
		setActiveButton("remove");
		if (!queue.isEmpty()) {
			queue.element()!.state = ElementStates.Changing;
			await delay();
			queue.dequeue();
			setArray([...queue.elements()]);
		}
		setActiveButton(null);
		setLoader(false);
	};

	const handleReset = async () => {
		setLoader(true);
		setActiveButton("clear");
		queue.clear();
		await delay();
		setInputValue("");
		setArray([...queue.elements()]);
		setLoader(false);
	};

	return (
		<SolutionLayout title="Очередь">
			<form
				className={styles.form}
				onSubmit={handleSubmit}
				onReset={handleReset}
			>
				<div className={styles.switcher}>
					<Input
						placeholder="Введите текст"
						maxLength={4}
						isLimitText={true}
						onChange={(e) =>
							setInputValue((e.target as HTMLInputElement).value)
						}
						value={inputValue}
						name="inputValue"
						disabled={loader}
					/>

					<Button
						text="Добавить"
						disabled={loader || queue.tail === 7}
						type="submit"
						isLoader={loader && activeButton === "add"}
					/>
					<Button
						text="Удалить"
						disabled={loader || queue.isEmpty()}
						onClick={handleRemove}
						type="button"
						isLoader={loader && activeButton === "remove"}
					/>
				</div>
				<Button
					text="Очистить"
					disabled={
						loader ||
						(queue.isEmpty() && queue.head === 0 && queue.tail === 0)
					}
					onClick={handleReset}
					isLoader={loader && activeButton === "clear"}
				/>
			</form>
			<ul className={styles.animation}>
				{array.map((item, index) => (
					<li key={index}>
						<Circle
							letter={item?.data}
							state={item?.state}
							index={index}
							head={
								!queue.isEmpty() && index === queue.head ? "head" : ""
							}
							tail={
								!queue.isEmpty() && index === queue.tail - 1
									? "tail"
									: ""
							}
						/>
					</li>
				))}
			</ul>
		</SolutionLayout>
	);
};
