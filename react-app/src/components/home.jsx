import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();
    return (
        <div className="home">
            <h2>Welcome to Real Otakus 😃</h2>
            <p>So you are a real otaku? lets find out !</p>
            <button onClick={() => navigate("/quiz")}>Take Quiz</button>
        </div>
    )
    {/* <a target="_blank" href="https://icons8.com/icon/f5EUqS9jsK4D/online-game">Online Game</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a> */ }
}