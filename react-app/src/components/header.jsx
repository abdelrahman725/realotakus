import { Link } from 'react-router-dom';

export default function Header({ score }) {
    return (
        <div className="header">
            <Link to="/" className="home_link"><h1>Real Otakus</h1></Link>
            <p className="quote">
                created with love and enthusiasm <span className="heart">&#10084;</span>
            </p>
            <p className="score">Otaku Score:  <strong>{score}</strong></p>
        </div>
    )
}
