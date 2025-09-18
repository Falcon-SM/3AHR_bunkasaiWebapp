function Crossword() {
    // 3x3のシンプル例
    return (
        <table className="crossword-table">
            <tbody>
                <tr>
                    <td><input maxLength={1} /></td>
                    <td><input maxLength={1} /></td>
                    <td><input maxLength={1} /></td>
                </tr>
                <tr>
                    <td><input maxLength={1} /></td>
                    <td><input maxLength={1} /></td>
                    <td><input maxLength={1} /></td>
                </tr>
                <tr>
                    <td><input maxLength={1} /></td>
                    <td><input maxLength={1} /></td>
                    <td><input maxLength={1} /></td>
                </tr>
            </tbody>
        </table>
    );
}
