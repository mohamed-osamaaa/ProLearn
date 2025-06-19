import React from 'react';
import level1 from "../../src/assets/level1.png"

const levels = [
    {
        level: 1,
        title: "Level 1",
        img: level1,
    },
    {
        level: 2,
        title: "Level 2",
        img: level1,
    },
    {
        level: 3,
        title: "Level 3",
        img: level1,
    },
];

function Levels() {
    return (
        <div id="levels" className="flex flex-col items-center my-20">
            <h1 className="text-4xl font-bold mb-20">Choose Your Level</h1>
            <div className="flex flex-row gap-10">
                {levels.map((lvl) => (
                    <button
                        key={lvl.level}
                        className="flex flex-col items-center bg-[#23244d] border-2 border-blue-400 rounded-lg shadow-lg px-8 py-6 hover:bg-blue-600 transition duration-300 w-[450px] h-[400px]"
                    >
                        <img
                            src={lvl.img}
                            alt={lvl.title}
                            className="mb-10 w-full h-3/4 object-cover"
                        />
                        <h1 className="text-2xl font-semibold text-white">{lvl.title}</h1>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Levels;