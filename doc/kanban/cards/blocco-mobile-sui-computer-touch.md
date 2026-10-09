# Il blocco per il telefono scatta anche sui computer con il touch

`MobileBlock` decide che il dispositivo è un telefono con `navigator.maxTouchPoints > 0`.
Ma un portatile con lo schermo touch ha i punti di contatto e anche il mouse, e così forse
un iPad con tastiera e trackpad: chi li usa trova "This service works on desktop only" dal
computer.

L'app non chiede un computer: chiede un puntatore preciso, per trascinare e cliccare sulle
caselle di testo. È quello che va chiesto al browser: `matchMedia('(any-pointer: fine)')`
dice se c'è almeno un mouse o un trackpad, e un portatile touch risponde sì.

## Dove si corregge

La rilevazione sta in `isMobileDevice()`, in `src/lib/browser/device.ts`, usata da
`MobileBlock` e dall'Intro; i loro test la mockano come modulo, quindi non cambiano. Il
nome andrà rivisto con lei: dirà se c'è un puntatore preciso, non se è un telefono.
