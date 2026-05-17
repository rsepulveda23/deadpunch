
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '1.5rem',
			screens: {
				'2xl': '1440px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
				stencil: ['"Bebas Neue"', '"Space Grotesk"', 'sans-serif'],
				mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
			},
			letterSpacing: {
				'mega': '-0.04em',
				'tightest': '-0.03em',
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// DEADPUNCH — sports performance palette.
				// "red" name is legacy; values are now the volt accent.
				deadpunch: {
					red: '#D7FE3C',
					'red-bright': '#E5FF5C',
					'red-hover': '#B8E020',
					volt: '#D7FE3C',
					'volt-bright': '#E5FF5C',
					'volt-hover': '#B8E020',
					felt: '#0B2A1E',
					'felt-light': '#16442F',
					bone: '#EDE7DA',
					chalk: '#F5F1E6',
					dark: '#0A0A0A',
					'dark-lighter': '#121212',
					'dark-lightest': '#1A1A1A',
					'gray-light': '#A6A6A6',
					'gray-dark': '#262626',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-in-right': {
					'0%': { opacity: '0', transform: 'translateX(20px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				'fade-in-left': {
					'0%': { opacity: '0', transform: 'translateX(-20px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				'pulse-glow': {
					'0%, 100%': {
						boxShadow: '0 0 24px 0 rgba(215, 254, 60, 0.25)',
						transform: 'scale(1)'
					},
					'50%': {
						boxShadow: '0 0 36px 4px rgba(215, 254, 60, 0.55)',
						transform: 'scale(1.01)'
					}
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'marquee': {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(-50%)' }
				},
				'ticker-flash': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.35' }
				},
				'grid-pan': {
					'0%': { backgroundPosition: '0 0' },
					'100%': { backgroundPosition: '60px 60px' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.7s ease-out',
				'fade-in-right': 'fade-in-right 0.7s ease-out',
				'fade-in-left': 'fade-in-left 0.7s ease-out',
				'pulse-glow': 'pulse-glow 3s infinite',
				'float': 'float 6s ease-in-out infinite',
				'marquee': 'marquee 40s linear infinite',
				'marquee-fast': 'marquee 20s linear infinite',
				'ticker-flash': 'ticker-flash 1.6s ease-in-out infinite',
				'grid-pan': 'grid-pan 8s linear infinite'
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
				'volt-gradient': 'linear-gradient(135deg, #D7FE3C 0%, #B8E020 100%)',
				'felt-gradient': 'radial-gradient(ellipse at top, #16442F 0%, #0A0A0A 70%)',
				'grid-lines': "linear-gradient(rgba(215,254,60,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(215,254,60,0.06) 1px, transparent 1px)",
				'noise-texture': 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%\' height=\'100%\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
			},
			backgroundSize: {
				'grid': '60px 60px',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
