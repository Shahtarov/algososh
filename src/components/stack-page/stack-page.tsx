import { ChangeEvent, useEffect, useState, FC } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/element-states";
import { Stack } from "../../utils/stack";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import styles from "./stack-page.module.css";

interface IStackItem {
	data: string;
	state: ElementStates;
}

export const StackPage: FC = () => {
	const [isLoader, setIsLoader] = useState<boolean>(false);
	const [action, setAction] = useState<string>("");
	const [input, setInput] = useState<string>("");
	const [stack, setStack] = useState(new Stack<IStackItem>());

	const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
		setInput(e.target.value);
	};

	const onClickPush = () => {
		if (!input) return;
		const newItem: IStackItem = {
			data: input,
			state: ElementStates.Changing
		};
		setStack((prevStack) => {
			const newStack = new Stack<IStackItem>(prevStack.elements());
			newStack.push(newItem);
			return newStack;
		});
		setIsLoader(true);
		setAction("push");
		setInput("");
	};

	const onClickPop = () => {
		if (stack.size() === 0) return;
		setStack((prevStack) => {
			const newStack = new Stack<IStackItem>(prevStack.elements());
			newStack.pop();
			return newStack;
		});
		setIsLoader(true);
		setAction("pop");
	};

	const onClickDrop = () => {
		if (stack.size() === 0) return;
		setStack(new Stack<IStackItem>());
	};

	useEffect(() => {
		const interval = setInterval(() => {
			if (isLoader) {
				if (action === "push") {
					setStack((prevStack) => {
						const newStack = new Stack<IStackItem>(prevStack.elements());
						newStack.elements()[prevStack.size() - 1].state =
							ElementStates.Default;
						return newStack;
					});
				}
				setIsLoader(false);
			}
		}, SHORT_DELAY_IN_MS);

		return () => clearInterval(interval);
	}, [isLoader, action]);

	return (
		<SolutionLayout title="Стек">
			<div className={styles.form}>
				<Input
					id="input"
					maxLength={4}
					isLimitText={true}
					onChange={onChangeInput}
					value={input}
				/>
				<div className={styles.switcher}>
					<Button
						type="button"
						text="Добавить"
						onClick={onClickPush}
						isLoader={isLoader && action === "push"}
						disabled={(isLoader && action !== "push") || !input}
					/>
					<Button
						type="button"
						text="Удалить"
						onClick={onClickPop}
						isLoader={isLoader && action === "pop"}
						disabled={
							(isLoader && action !== "pop") || stack.size() === 0
						}
					/>
				</div>
				<Button
					type="button"
					text="Очистить"
					onClick={onClickDrop}
					disabled={isLoader || stack.size() === 0}
				/>
			</div>
			<div className={styles.animation}>
				{stack.elements().map((item, index) => {
					const head = index === stack.size() - 1 ? "top" : "";
					return (
						<Circle
							key={index}
							index={index}
							letter={item.data}
							state={item.state}
							head={head}
						/>
					);
				})}
			</div>
		</SolutionLayout>
	);
};
