import { fabric } from 'fabric'
import { useEffect } from 'react'
import Hammer from 'hammerjs'

function App() {
	var blockSize = 10
	var rows = 40
	var cols = 22

	function randomX() {
		let X = Math.floor(Math.random() * cols) * blockSize
		if (X >= 210) {
			console.log('bigX')
			return X - 10
		} else {
			return X
		}
	}
	function randomY() {
		let Y = Math.floor(Math.random() * rows) * blockSize
		if (Y >= 380) {
			console.log('bigY')
			return Y - 10
		} else {
			return Y
		}
	}

	var snakeX = blockSize * 5
	var snakeY = blockSize * 5

	var velocityX = 0
	var velocityY = 0

	const options = {
		top: 0,
		left: 0,
		height: rows * blockSize,
		width: cols * blockSize,
		backgroundColor: 'rgba(1, 22, 39, 0.84)',
		selection: false,
	}
	const headOptions = {
		top: randomY(),
		left: randomX(),
		width: blockSize,
		height: blockSize,
		//fill: '#43D9AD',
		//stroke: '#43D9AD',
		//strokeWidth: 0.05,
		selectable: false,
		dirty: false,
		centeredRotation: true,
	}
	const foodOptions = {
		top: randomY() + 10,
		left: randomX() + 10,
		//width: blockSize,
		//height: blockSize,

		//fill: 'red',
		selectable: false,
		dirty: false,
	}

	let isGameover = false
	let isgameStart = false
	const snake = []
	const comman = { fill: '#43D9AD', originX: 'center', originY: 'center' }

	useEffect(() => {
		const canvas = new fabric.Canvas('canvas', options)
		//const food = new fabric.Rect(foodOptions)
		const gOText = new fabric.Text(`GAME OVER!`, {
			fontSize: 24,
			fill: '#43D9AD',
			fontFamily: 'Fira Code',
			top: 12,
			left: 48,
			fontWeight: 450,
			lineHeight: 24,
		})
		const textBox = new fabric.Rect({
			fill: 'rgba(1, 22, 39, 0.84)',
			height: 48,
			width: 220,
			stroke: 'rgba(2, 18, 27, 0.71)',
			strokeWidth: 2,
		})
		const textBox1 = new fabric.Rect({
			height: 48,
			width: 220,
			fill: 'transparent',
		})

		const gameOverText = new fabric.Group([textBox, gOText], {
			top: 0,
			selectable: false,
			dirty: false,
		})
		//const scoreText = new fabric.Text(`score : ${snake.length}`)
		const restartText = new fabric.Text(`hit space to restart`, {
			fontSize: 14,
			fill: '#607B96',
			fontFamily: 'Fira Code',
			originX: 'center',
			fontWeight: 450,
		})
		const restartGameText = new fabric.Group([textBox1, restartText], {
			top: 300,
			left: 25,
			selectable: false,
			dirty: false,
		})

		const circle1 = new fabric.Circle({
			radius: 5,
			...comman,
		})
		const circle2 = new fabric.Circle({
			radius: 10,
			opacity: 0.2,
			...comman,
		})
		const circle3 = new fabric.Circle({
			radius: 15,
			opacity: 0.1,
			...comman,
		})
		const eye1 = new fabric.Circle({
			radius: 1.5,
			fill: 'black',
			left: 1,
		})
		const eye2 = new fabric.Circle({
			radius: 1.5,
			fill: 'black',
			left: 6,
		})
		let eyes = new fabric.Group([eye1, eye2], { height: 3, width: 10 })
		const background = new fabric.Rect({
			height: 10,
			width: 10,
			fill: '#43D9AD',
		})
		const rect = new fabric.Group([background, eyes], headOptions)
		let food = new fabric.Group([circle1, circle2, circle3], foodOptions)
		const downPath = new fabric.Path('M0-5 5-5 5 0C4 7-4 7-5 0L-5-5 0-5')
		const upPath = new fabric.Path('M5 0 5 5-5 5-5 0C-3-7 3-7 5 0')
		const rightPath = new fabric.Path('M0-5-5-5-5 5 0 5C7 4 7-4 0-5')
		const leftPath = new fabric.Path('M0 5 5 5 5-5 0-5C-7-4-7 4 0 5')
		const circlePath = new fabric.Path(
			'M0-5C3-5 5-3 5 0 5 3 3 5 0 5-3 5-5 3-5 0-5-3-3-5 0-5'
		)
		background.clipPath = circlePath
		const startGame = () => {
			isgameStart = true

			if (!isGameover) {
				window.setTimeout(update, 100)
			} else {
				canvas.add(gameOverText)

				canvas.add(restartGameText)
				gameOverText.animate('top', '+=200', {
					onChange: canvas.renderAll.bind(canvas),
					duration: 1000,
					easing: fabric.util.ease['easeOutElastic'],
				})
				canvas.renderAll()
			}
		}

		const restartGame = () => {
			isGameover = false
			isgameStart = false

			canvas.remove(gameOverText)
			canvas.remove(restartGameText)
			gameOverText.set('top', 0)

			rect.set({ left: randomX(), top: randomY() })
			food.set({ left: randomX(), top: randomY() })

			console.log(`food.left : ${food.left}`)
			console.log(`food.top : ${food.top}`)
			console.log(`rect.left : ${rect.left}`)
			console.log(`rect.top : ${rect.top}`)
			canvas.renderAll()
		}

		function ChangeDirection(direction) {
			if (direction === 'up') {
				if (!isgameStart) {
					startGame()
				}
				velocityX = 0
				velocityY = -1

				eyes.set({ angle: 0, left: -5, top: -5 })

				background.set('clipPath', upPath)
				//rect.clipPath = upPath
			} else if (direction === 'down') {
				if (!isgameStart) {
					startGame()
				}
				velocityX = 0
				velocityY = 1
				eyes.set({ angle: 0, left: -5, top: 2 })

				background.set('clipPath', downPath)
			} else if (direction === 'left') {
				if (!isgameStart) {
					startGame()
				}
				velocityX = -1
				velocityY = 0
				eyes.set({ angle: 90, left: -2, top: -5 })
				background.set('clipPath', leftPath)
			} else if (direction === 'right') {
				if (!isgameStart) {
					startGame()
				}
				velocityX = 1
				velocityY = 0
				eyes.set({ angle: 90, left: 5, top: -5 })
				background.set('clipPath', rightPath)
			}
			canvas.renderAll()
		}

		const canv = document.getElementById('upper-container')
		var mc = new Hammer(canv)
		mc.get('pan').set({ direction: Hammer.DIRECTION_ALL })
		mc.on('panleft panright panup pandown tap press', function (e) {
			if (e.type === 'panup' && velocityY !== 1) {
				ChangeDirection('up')
			} else if (e.type === 'pandown' && velocityY !== -1) {
				ChangeDirection('down')
			} else if (e.type === 'panleft' && velocityX !== 1) {
				ChangeDirection('left')
			} else if (e.type === 'panright' && velocityX !== -1) {
				ChangeDirection('right')
			} else if (e.type === 'tap') {
				restartGame()
			}
		})

		window.addEventListener('keyup', e => {
			if (e.code === 'ArrowUp' && velocityY !== 1) {
				ChangeDirection('up')
			} else if (e.code === 'ArrowDown' && velocityY !== -1) {
				ChangeDirection('down')
			} else if (e.code === 'ArrowLeft' && velocityX !== 1) {
				ChangeDirection('left')
			} else if (e.code === 'ArrowRight' && velocityX !== -1) {
				ChangeDirection('right')
			} else if (e.code === 'Space') {
				restartGame()
			}
		})

		const update = () => {
			for (let i = snake.length - 1; i > 0; i--) {
				snake[i].set('left', snake[i - 1].left)
				snake[i].set('top', snake[i - 1].top)
			}
			if (snake.length) {
				snake[0].set('left', rect.left)
				snake[0].set('top', rect.top)
			}

			rect.left += velocityX * blockSize
			rect.top += velocityY * blockSize

			for (let i = 1; i < snake.length; i++) {
				if (snake[i].left === rect.left && snake[i].top === rect.top) {
					isGameover = true
				}
			}

			rect.animate(
				{ left: rect.left, top: rect.top },
				{
					duration: 100,

					easing: fabric.util.ease['easeInOutQuad'],
				}
			)

			let color = 1
			for (let i = 0; i < snake.length; i++) {
				color = color - 0.02
				snake[i].set('fill', `rgba(67, 217, 173, ${color})`)
				snake[i].set('stroke', `rgba(67, 217, 173, ${color})`)
			}

			if (
				rect.top < 0 ||
				rect.left < 0 ||
				rect.top >= canvas.height ||
				rect.left >= canvas.width
			) {
				isGameover = true
			}
			if (rect.left === food.left + 10 && rect.top === food.top + 10) {
				let snakeBody = new fabric.Rect({
					top: food.top + 10,
					left: food.left + 10,
					width: blockSize + 0.1,
					height: blockSize + 0.1,
					fill: '#43D9AD',
					stroke: '#43D9AD',
					strokeWidth: 0.05,
					selectable: false,
					dirty: false,
				})
				canvas.add(snakeBody)
				snake.push(snakeBody)
				//score.set('text', `score : ${snake.length}`)
				food.set({ left: randomX(), top: randomY() })
			}
			canvas.renderAll()

			startGame()
		}
		canvas.add(rect)

		canvas.add(food)
		//canvas.add(rect)
		//canvas.add(score)
		canvas.renderAll()
	})

	return (
		<div id='upper-container'>
			<canvas id='canvas' />
		</div>
	)
}

export default App
