import {
	useState,
	FC,
	ChangeEvent,
	FormEvent,
	useEffect,
	useMemo
} from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import styles from "./string.module.css";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/element-states";
import { swap } from "../../utils/swap";
import { DELAY_IN_MS } from "../../constants/delays";

export interface IArrString {
	data: string;
	state: ElementStates;
}

export const StringComponent: FC = () => {
	const [start, setStart] = useState<number>(0);
	const [end, setEnd] = useState<number>(0);
	const [input, setInput] = useState<string>("");
	const [isLoader, setIsLoader] = useState<boolean>(false);
	const [arrayToAnimate, setArrayToAnimate] = useState<IArrString[]>([]);

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (!isLoader) {
			setInput(e.target.value);
		}
	};

	const onSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!isLoader) {
			setIsLoader(true);

			const array: IArrString[] = input.split("").map((item) => {
				return {
					data: item,
					state: ElementStates.Default
				};
			});

			if (array.length === 1) {
				array[0]["state"] = ElementStates.Modified;
			} else {
				array[0]["state"] = ElementStates.Changing;
				array[array.length - 1]["state"] = ElementStates.Changing;
			}

			setStart(0);
			setEnd(array.length - 1);
			setArrayToAnimate(array);
		}
	};

	useEffect(() => {
		const interval = setInterval(() => {
			if (isLoader && start < end) {
				const array: IArrString[] = arrayToAnimate.slice();
				swap<string>(array, start, end);

				array[start]["state"] = ElementStates.Modified;
				array[end]["state"] = ElementStates.Modified;

				array[start + 1]["state"] = ElementStates.Changing;
				array[end - 1]["state"] = ElementStates.Changing;

				setStart(start + 1);
				setEnd(end - 1);
				setArrayToAnimate(array);
			} else if (isLoader) {
				const array: IArrString[] = arrayToAnimate.slice();
				array[start]["state"] = ElementStates.Modified;
				array[end]["state"] = ElementStates.Modified;
				setArrayToAnimate(array);

				setIsLoader(false);
			}
		}, DELAY_IN_MS);

		return () => {
			clearInterval(interval);
		};
	}, [isLoader, arrayToAnimate, start, end]);

	const arrayToAnimateMemo = useMemo(() => arrayToAnimate, [arrayToAnimate]);

	return (
		<SolutionLayout title="Строка">
			<form action="" onSubmit={onSubmit} data-testid="stringComponent">
				<div className={styles.form}>
					<Input
						maxLength={11}
						isLimitText={true}
						onChange={onChange}
						value={input}
					></Input>
					<Button
						type="submit"
						text={"Развернуть"}
						isLoader={isLoader}
						disabled={isLoader || !input}
						value={input}
					></Button>
				</div>
				<div className={styles.animation}>
					{arrayToAnimateMemo &&
						arrayToAnimateMemo.map((item, index) => {
							return (
								<Circle
									key={index}
									letter={item["data"]}
									state={item["state"]}
								></Circle>
							);
						})}
				</div>
			</form>
		</SolutionLayout>
	);
};
