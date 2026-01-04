import { describe, it, expect } from 'vitest'
import { createHighResGrid, generateMazeBorders, findAreas, generateMaze, Grid } from './maze'

describe('createHighResGrid', () => {
  it('raddoppia la dimensione della griglia', () => {
    const input: Grid = [
      [0, 1],
      [1, 0],
    ]

    const result = createHighResGrid(input)

    expect(result.length).toBe(4)
    expect(result[0].length).toBe(4)
  })

  it('espande correttamente i valori', () => {
    const input: Grid = [
      [0, 1],
      [1, 0],
    ]

    const result = createHighResGrid(input)

    expect(result[0][0]).toBe(0)
    expect(result[0][1]).toBe(0)
    expect(result[0][2]).toBe(1)
    expect(result[0][3]).toBe(1)
    expect(result[1][0]).toBe(0)
    expect(result[1][1]).toBe(0)
    expect(result[2][2]).toBe(0)
    expect(result[2][3]).toBe(0)
  })
})

describe('generateMazeBorders', () => {
  it('genera bordi esterni sulla riga inferiore', () => {
    const grid: Grid = [
      [0, 0],
      [0, 0],
    ]

    const borders = generateMazeBorders(grid)

    expect(borders.horizontal[1][0]).toBe(true)
    expect(borders.horizontal[1][1]).toBe(true)
  })

  it('genera bordi esterni sulla colonna destra', () => {
    const grid: Grid = [
      [0, 0],
      [0, 0],
    ]

    const borders = generateMazeBorders(grid)

    expect(borders.vertical[0][1]).toBe(true)
    expect(borders.vertical[1][1]).toBe(true)
  })

  it('genera bordi tra celle di colore diverso', () => {
    const grid: Grid = [
      [0, 1],
      [0, 1],
    ]

    const borders = generateMazeBorders(grid)

    expect(borders.vertical[0][0]).toBe(true)
    expect(borders.vertical[1][0]).toBe(true)
  })
})

describe('findAreas', () => {
  it('trova aree separate dai bordi', () => {
    const grid: Grid = [
      [0, 1],
      [0, 1],
    ]
    const borders = generateMazeBorders(grid)

    const areas = findAreas(grid, borders)

    expect(areas.length).toBeGreaterThanOrEqual(2)
  })

  it('identifica correttamente il colore delle aree', () => {
    const grid: Grid = [
      [0, 1],
      [0, 1],
    ]
    const borders = generateMazeBorders(grid)

    const areas = findAreas(grid, borders)

    const blackAreas = areas.filter((a) => a.isBlack)
    const whiteAreas = areas.filter((a) => !a.isBlack)

    expect(blackAreas.length).toBeGreaterThan(0)
    expect(whiteAreas.length).toBeGreaterThan(0)
  })
})

describe('generateMaze', () => {
  it('genera un maze completo da una matrice QR', () => {
    const qrMatrix: Grid = [
      [1, 1, 0],
      [1, 0, 0],
      [0, 0, 1],
    ]

    const result = generateMaze(qrMatrix)

    expect(result.grid.length).toBe(6)
    expect(result.borders.horizontal).toBeDefined()
    expect(result.borders.vertical).toBeDefined()
    expect(result.areas.length).toBeGreaterThan(0)
  })

  it('mantiene la connettività delle aree', () => {
    const qrMatrix: Grid = [
      [0, 0],
      [0, 0],
    ]

    const result = generateMaze(qrMatrix)

    const totalCells = result.areas.reduce((sum, area) => sum + area.cells.length, 0)
    expect(totalCells).toBe(16)
  })
})