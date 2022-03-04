import textToCellsParser from './textToCellsParser'
describe('textToCellsParser', () => {
    it('handles just text cells copied from excel', () => {
        const testInput = `A1	B1
A2	B2`
        const cells = textToCellsParser(testInput)
        expect(cells).toStrictEqual([{ cells: ['A1','B1'] }, { cells: ['A2','B2'] }]);
    });
    it('handles text cells with newline in them', () => {
        const testInput = `B1	"C1\nc1"
B2	C2`
        const cells = textToCellsParser(testInput)
        expect(cells).toStrictEqual([{ cells: ['B1','C1\nc1'] }, { cells: ['B2','C2'] }]);
    });
})

  