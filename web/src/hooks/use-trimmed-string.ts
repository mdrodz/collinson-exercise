import { type Dispatch, useState, type SetStateAction } from 'react';

export default function useTrimmedString(initialValue = '')
{
	const [value, setValue] = useState(initialValue.trim());

	const setTrimmedValue: Dispatch<SetStateAction<string>> = (nextValue) => {
		setValue(currentValue => {
			const valueToSet = typeof nextValue === 'function'
				? nextValue(currentValue)
				: nextValue;

			return valueToSet.trim();
		});
	};

	return [value, setTrimmedValue] as const;
}
