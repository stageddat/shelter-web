<script lang="ts">
	// escena provisional hasta tener los dibujos de la artista: estrellas, nubes, casa, gato, flores y hierba

	const stars = [
		{ top: 8, left: 9, size: 22, delay: 0 },
		{ top: 20, left: 17, size: 14, delay: 1.2 },
		{ top: 6, left: 32, size: 18, delay: 0.6 },
		{ top: 12, left: 50, size: 12, delay: 2 },
		{ top: 5, left: 68, size: 20, delay: 1.6 },
		{ top: 18, left: 80, size: 13, delay: 0.3 },
		{ top: 30, left: 6, size: 10, delay: 2.4 },
		{ top: 28, left: 92, size: 16, delay: 0.9 },
		{ top: 38, left: 24, size: 9, delay: 1.8 },
		{ top: 40, left: 74, size: 10, delay: 2.8 }
	];

	const clouds = [
		{ top: 8, width: 160, duration: 90, delay: -20 },
		{ top: 18, width: 110, duration: 120, delay: -70 },
		{ top: 30, width: 140, duration: 105, delay: -45 }
	];

	// hierba: una línea ondulada que se estira a todo el ancho
	const grassPath = (() => {
		let d = 'M0 60 V28 Q12 14 25 28';
		for (let x = 50; x <= 1000; x += 25) d += ` T${x} 28`;
		return d + ' V60 Z';
	})();

	const petals = Array.from({ length: 8 }, (_, i) => i * 45);
</script>

<div class="scene-art" aria-hidden="true">
	<div class="stars">
		{#each stars as s, i (i)}
			<svg
				viewBox="0 0 24 24"
				class="star"
				style:top="{s.top}%"
				style:left="{s.left}%"
				style:width="{s.size}px"
				style:animation-delay="{s.delay}s"
			>
				<path d="M12 0C13 8 16 11 24 12C16 13 13 16 12 24C11 16 8 13 0 12C8 11 11 8 12 0Z" />
			</svg>
		{/each}
	</div>

	<div class="clouds">
		{#each clouds as c, i (i)}
			<svg
				viewBox="0 0 120 50"
				class="cloud"
				style:top="{c.top}%"
				style:width="{c.width}px"
				style:animation-duration="{c.duration}s"
				style:animation-delay="{c.delay}s"
			>
				<circle cx="35" cy="30" r="17" />
				<circle cx="60" cy="22" r="22" />
				<circle cx="86" cy="31" r="15" />
				<rect x="20" y="28" width="82" height="18" rx="9" />
			</svg>
		{/each}
	</div>

	<!-- flores a la izquierda -->
	<svg viewBox="0 0 160 160" class="flowers">
		{#each [{ x: 45, y: 40, h: 1 }, { x: 115, y: 70, h: 0.8 }] as f, i (i)}
			<path
				d="M{f.x} 160 C{f.x - 4} 130 {f.x + 6} 100 {f.x} {f.y}"
				class="stem"
				stroke-width="4"
				fill="none"
			/>
			<ellipse
				cx={f.x + 10}
				cy={f.y + 70}
				rx="12"
				ry="5"
				class="leaf"
				transform="rotate(-30 {f.x + 10} {f.y + 70})"
			/>
			<g transform="translate({f.x} {f.y}) scale({f.h})">
				{#each petals as angle (angle)}
					<ellipse cx="0" cy="-14" rx="6" ry="11" class="petal" transform="rotate({angle})" />
				{/each}
				<circle r="8" class="flower-center" />
			</g>
		{/each}
	</svg>

	<!-- gato tumbado en el centro, debajo de la tarjeta -->
	<svg viewBox="0 0 320 150" class="cat">
		<path
			d="M285 112 C320 80 312 35 280 28"
			class="cat-tail"
			stroke-width="15"
			stroke-linecap="round"
			fill="none"
		/>
		<ellipse cx="180" cy="118" rx="112" ry="44" class="cat-body" />
		<polygon points="46,62 50,16 80,48" class="cat-body" />
		<polygon points="88,46 108,14 116,62" class="cat-body" />
		<circle cx="80" cy="88" r="40" class="cat-body" />
		<path d="M58 88 q7 7 14 0 M88 88 q7 7 14 0" class="cat-line" stroke-width="3" fill="none" />
		<path d="M77 100 l3 3 l3 -3" class="cat-line" stroke-width="2.5" fill="none" />
	</svg>

	<!-- casita a la derecha con la ventana encendida y humo -->
	<svg viewBox="0 0 200 260" class="house">
		<g class="smoke">
			<circle cx="141" cy="40" r="9" />
			<circle cx="141" cy="40" r="11" />
			<circle cx="141" cy="40" r="13" />
		</g>
		<rect x="130" y="55" width="22" height="70" class="roof" />
		<polygon points="14,138 100,62 186,138" class="roof" />
		<rect x="32" y="132" width="136" height="128" class="wall" />
		<rect x="84" y="186" width="34" height="74" rx="17" class="door" />
		<rect x="128" y="160" width="26" height="26" rx="3" class="window" />
		<rect x="46" y="160" width="26" height="26" rx="3" class="window" />
		<path d="M141 160v26M128 173h26M59 160v26M46 173h26" class="frame" stroke-width="2.5" />
	</svg>

	<svg viewBox="0 0 1000 60" preserveAspectRatio="none" class="grass">
		<path d={grassPath} />
	</svg>
</div>

<style>
	/* colores de la escena por tema */
	:global(:root) {
		--art-grass: oklch(72% 0.09 135);
		--art-grass-dark: oklch(55% 0.1 140);
		--art-wall: oklch(88% 0.04 70);
		--art-roof: oklch(55% 0.11 35);
		--art-door: oklch(45% 0.06 45);
		--art-window: oklch(90% 0.08 85);
		--art-frame: oklch(45% 0.06 45);
		--art-cat: oklch(42% 0.03 50);
		--art-cat-line: oklch(88% 0.03 70);
		--art-petal: oklch(82% 0.13 85);
		--art-flower-center: oklch(50% 0.09 50);
		--art-cloud: oklch(99% 0.01 80);
		--art-smoke: oklch(90% 0.01 70);
	}

	:global(.dark) {
		--art-grass: oklch(28% 0.05 135);
		--art-grass-dark: oklch(36% 0.07 135);
		--art-wall: oklch(30% 0.02 50);
		--art-roof: oklch(24% 0.04 30);
		--art-door: oklch(20% 0.02 40);
		--art-window: oklch(80% 0.14 75);
		--art-frame: oklch(30% 0.02 50);
		--art-cat: oklch(17% 0.01 50);
		--art-cat-line: oklch(75% 0.12 75);
		--art-petal: oklch(70% 0.12 80);
		--art-flower-center: oklch(35% 0.06 50);
		--art-star: oklch(92% 0.06 90);
		--art-smoke: oklch(40% 0.01 60);
	}

	:global([data-theme='mocha-lavender']) {
		--art-grass: oklch(32% 0.05 165);
		--art-grass-dark: oklch(40% 0.06 160);
		--art-wall: oklch(36% 0.035 285);
		--art-roof: oklch(29% 0.045 320);
		--art-door: oklch(24% 0.03 284);
		--art-window: oklch(92% 0.07 87);
		--art-frame: oklch(36% 0.035 285);
		--art-cat: oklch(19% 0.03 284);
		--art-cat-line: oklch(82% 0.09 277);
		--art-petal: oklch(87% 0.08 336);
		--art-flower-center: oklch(79% 0.12 305);
		--art-star: oklch(88% 0.06 280);
		--art-smoke: oklch(42% 0.03 284);
	}

	.scene-art {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
	}

	.scene-art svg {
		position: absolute;
	}

	/* estrellas de noche, nubes de día */
	.stars,
	:global(.dark) .clouds {
		display: none;
	}

	:global(.dark) .stars {
		display: block;
	}

	.star {
		fill: var(--art-star);
		animation: twinkle 4s ease-in-out infinite;
	}

	.cloud {
		left: 0;
		fill: var(--art-cloud);
		opacity: 0.9;
		animation: drift linear infinite;
	}

	.grass {
		bottom: 0;
		left: 0;
		width: 100%;
		height: clamp(36px, 7vh, 64px);
		fill: var(--art-grass);
	}

	.house {
		right: 4vw;
		bottom: clamp(20px, 4vh, 40px);
		width: clamp(110px, 13vw, 210px);
	}

	.cat {
		bottom: clamp(18px, 3.5vh, 36px);
		left: 50%;
		width: clamp(170px, 22vw, 340px);
		transform: translateX(-55%);
	}

	.flowers {
		bottom: clamp(20px, 4vh, 40px);
		left: 10vw;
		width: clamp(80px, 9vw, 150px);
	}

	.wall {
		fill: var(--art-wall);
	}
	.roof {
		fill: var(--art-roof);
	}
	.door {
		fill: var(--art-door);
	}
	.window {
		fill: var(--art-window);
	}
	:global(.dark) .window {
		filter: drop-shadow(0 0 8px var(--art-window));
	}
	.frame {
		stroke: var(--art-frame);
	}
	.cat-body {
		fill: var(--art-cat);
	}
	.cat-tail {
		stroke: var(--art-cat);
		transform-origin: 285px 112px;
		animation: tail 5s ease-in-out infinite;
	}
	.cat-line {
		stroke: var(--art-cat-line);
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.stem {
		stroke: var(--art-grass-dark);
	}
	.leaf {
		fill: var(--art-grass-dark);
	}
	.petal {
		fill: var(--art-petal);
	}
	.flower-center {
		fill: var(--art-flower-center);
	}

	.smoke circle {
		fill: var(--art-smoke);
		transform-box: fill-box;
		transform-origin: center;
		animation: smoke 6s ease-out infinite;
	}
	.smoke circle:nth-child(2) {
		animation-delay: 2s;
	}
	.smoke circle:nth-child(3) {
		animation-delay: 4s;
	}

	@keyframes twinkle {
		0%,
		100% {
			opacity: 0.9;
			transform: scale(1);
		}
		50% {
			opacity: 0.35;
			transform: scale(0.8);
		}
	}

	@keyframes drift {
		from {
			transform: translateX(-200px);
		}
		to {
			transform: translateX(100vw);
		}
	}

	@keyframes smoke {
		0% {
			opacity: 0;
			transform: translate(0, 0) scale(0.6);
		}
		20% {
			opacity: 0.8;
		}
		100% {
			opacity: 0;
			transform: translate(14px, -45px) scale(1.4);
		}
	}

	@keyframes tail {
		0%,
		100% {
			transform: rotate(0deg);
		}
		50% {
			transform: rotate(-8deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.scene-art * {
			animation: none !important;
		}
	}
</style>
