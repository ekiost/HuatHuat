import React, { useState } from 'react';
import { Player } from '../type/types';

interface Props {
    player: Player;
    onWinLoseChange: (id: number, winLoseAmount: number) => void;
}

const PlayerComponent: React.FC<Props> = ({ player, onWinLoseChange }) => {
    // Temporary state to hold the input value for real-time typing
    const [inputValue, setInputValue] = useState(player.winLoseAmount.toString());

    return (
        <div>
            <p>{player.name}: {player.chips} chips {player.isBanker ? '(Banker)' : ''}</p>
            {!player.isBanker && (
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                        // Allow any input, but you might want to validate it's a valid number format
                        setInputValue(e.target.value); // Directly update state from input
                    }}
                    onBlur={(e) => {
                        const value = e.target.value.trim();
                        let validatedValue = 0;
                        if (value === "-" || value === "" || isNaN(value as any)) {
                            // If it's invalid or empty, consider 0 or handle appropriately
                            validatedValue = 0;
                        } else {
                            // It's a valid number (including negative)
                            validatedValue = parseInt(value, 10);
                        }
                        onWinLoseChange(player.id, validatedValue);
                        setInputValue(validatedValue.toString()); // Update the input field to reflect the validated value
                    }}
                    placeholder="Win/Lose Amount"
                />
            )}
        </div>
    );
};

export default PlayerComponent;
