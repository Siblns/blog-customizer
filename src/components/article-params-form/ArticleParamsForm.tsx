import { ArrowButton } from 'src/ui/arrow-button';
import { useState, useRef, SyntheticEvent, useEffect } from 'react';
import styles from './ArticleParamsForm.module.scss';
import clsx from 'clsx';
import {
	OptionType,
	defaultArticleState,	
	fontFamilyOptions,
	fontSizeOptions,
	fontColors,
	backgroundColors,
	contentWidthArr
} from 'src/constants/articleProps';

import { Button } from 'src/ui/button';
import { Text } from 'src/ui/text';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import { Separator } from 'src/ui/separator';

export type MenuState = {
	fontFamilyOption: OptionType;
	fontColor: OptionType;
	backgroundColor: OptionType;
	contentWidth: OptionType;
	fontSizeOption: OptionType;
};

type ArticleParamsFormProps = {
	onSubmit: (params: MenuState) => void;
};

export const ArticleParamsForm = (props: ArticleParamsFormProps) => {
	const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
	const menuForm = useRef<HTMLElement | null>(null);
	const [menuState, setMenuState] = useState<MenuState>(defaultArticleState);
	
	//механизм открытия/закрытия окна
	const handleToggleMenu = () => {	
		setIsOpenMenu((prev) => !prev);
		};

	// Закрытие формы по клику вне её
	const handleClickOutside = (event: MouseEvent) => {
		if (menuForm.current && !menuForm.current.contains(event.target as Node)) {
			setIsOpenMenu(false);
		}
	};

	// Закрытие формы по нажатию клавиши Esc
	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			setIsOpenMenu(false);
		}
	};
	//добавляем или убираем слушателей
	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, []);
	//изменения формы
	const handleChangeParam = (key: keyof MenuState) => (value: OptionType) => {
		setMenuState((prevState) => ({
			...prevState,
			[key]: value,
		}));
	};
	//сбрасываем состояние к дефолту
	const handleParamsReset = () => {
		setMenuState(defaultArticleState);
		props.onSubmit(defaultArticleState);
	};
	//применяем состояние
	const handleFormSubmit = (evt: SyntheticEvent) => {
		evt.preventDefault();
		props.onSubmit(menuState);
	};

	return (
		<>
			<ArrowButton isOpen={isOpenMenu} onClick={handleToggleMenu} />
			<aside
			ref={menuForm}
			className= {
				clsx(styles.container, {
					[styles.container_open]: isOpenMenu
				})
			}
			>
				<form 
				className={styles.form}
				onSubmit={handleFormSubmit}
				onReset={handleParamsReset}		
				>
					<Text
						as='h2'
						family='open-sans'
						fontStyle='normal'
						uppercase
						size={31}
						weight={800}					
					>
						Задайте параметры
					</Text>
					<Select
						title='Шрифт'
						placeholder='Выберите шрифт'
						selected={menuState.fontFamilyOption}
						options={fontFamilyOptions}
						onChange={handleChangeParam('fontFamilyOption')}
					/>
					<RadioGroup
						title='Размер шрифта'
						name='fontSize'
						selected={menuState.fontSizeOption}
						options={fontSizeOptions}
						onChange={handleChangeParam('fontSizeOption')}	
					/>
					<Select
						title='Цвет шрифта'
						placeholder='Выберите цвет шрифта'
						selected={menuState.fontColor}
						options={fontColors}
						onChange={handleChangeParam('fontColor')}
					/>
					<Separator />
					<Select
						title='Цвет фона'
						placeholder='Выберите цвет фона'
						selected={menuState.backgroundColor}
						options={backgroundColors}
						onChange={handleChangeParam('backgroundColor')}		
					/>
					<Select
						title='Ширина контента'
						placeholder='Выберите ширину контента'
						selected={menuState.contentWidth}
						options={contentWidthArr}
						onChange={handleChangeParam('contentWidth')}
					/>
					<div 
						className={styles.bottomContainer}
					>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
