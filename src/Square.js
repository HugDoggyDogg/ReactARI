import React from 'react';

/**
 * Composant désignant une case de la grille.
 * @param props Props passés au composant
 * @return un élément <button>, avec une classe "square", son backgroundColor ainsi que l'action éxecuté lors du click sont passés dans les props.
 */
function Square(props){
	const {bgColor, onClick} = props;
	return (
		<button
			className="square"
			style={{backgroundColor: bgColor}}
			onClick={onClick}
		>

		</button>
	);
}
export default Square;
