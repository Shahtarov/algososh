import { ChangeEvent, FormEvent, useEffect, useState, FC } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import styles from "./fibonacci-page.module.css";

export const FibonacciPage: FC = () => {
	const [index, setIndex] = useState<number>(0);
	const [length, setLength] = useState<number>(0);
	const [input, setInput] = useState<string>("");
	const [isLoader, setIsLoader] = useState<boolean>(false);
	const [arrayToAnimate, setArrayToAnimate] = useState<number[]>([]);

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (!isLoader) {
			setInput(e.target.value);
		}
	};

	const onSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!isLoader) {
			setIsLoader(true);
			setArrayToAnimate([1]);
			setLength(Number(input));
			setIndex(0);
		}
	};

	useEffect(() => {
		const interval = setInterval(() => {
			if (isLoader) {
				if (index < length) {
					const array: number[] = arrayToAnimate.slice();
					let val = 1;
					if (index !== 0) {
						val = array[index] + array[index - 1];
					}
					setIndex(index + 1);
					array.push(val);
					setArrayToAnimate(array);
				} else {
					setIsLoader(false);
				}
			}
		}, SHORT_DELAY_IN_MS);

		return () => {
			clearInterval(interval);
		};
	}, [isLoader, index, arrayToAnimate, length]);

	return (
		<SolutionLayout title="Последовательность Фибоначчи">
			<form action="" onSubmit={onSubmit}>
				<div className={styles.form}>
					<Input
						max={19}
						isLimitText={true}
						type={"number"}
						onChange={onChange}
						value={input}
					></Input>
					<Button
						type="submit"
						text={"Рассчитать"}
						isLoader={isLoader}
						disabled={
							isLoader || !input || !Number(input) || Number(input) > 19
						}
					></Button>
				</div>
				<div className={styles.animation}>
					{arrayToAnimate &&
						arrayToAnimate.map((item, idx) => {
							return (
								<Circle
									key={idx}
									index={idx}
									letter={item.toString()}
								></Circle>
							);
						})}
				</div>
			</form>
		</SolutionLayout>
	);
};
