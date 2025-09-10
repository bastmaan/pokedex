import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

const typeColors = {
    grass: 'rgba(56, 168, 56, 0.85)',
    water: 'rgba(56, 112, 168, 0.85)',
    fire: 'rgba(220, 60, 60, 0.85)',
    electric: 'rgba(240, 220, 60, 0.85)',
    default: 'rgba(126, 112, 8, 0.9)'
};

function PokemonCard({ name, image, types = [], id }) {
    const [hovered, setHovered] = useState(false);
    const mainType = types[0] || 'default';
    const isSpecialType = ['grass', 'water', 'fire', 'electric'].includes(mainType);
    const borderColor = isSpecialType ? (typeColors[mainType] || typeColors.default) : '#fff';
    const bgColor = typeColors.default;
    const glowColor = hovered
        ? (isSpecialType
            ? (typeColors[mainType] || typeColors.default).replace('0.85', '0.7').replace('0.9', '0.7')
            : 'rgba(255,255,255,0.85)')
        : 'none';

    return (
        <Link to={`/pokemon/${name}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Box
                sx={{
                    border: `3px solid ${borderColor}`,
                    borderRadius: '8px',
                    padding: '8px',
                    width: '150px',
                    textAlign: 'center',
                    background: bgColor,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    position: 'relative',
                    overflow: 'visible',
                }}
                className="pokemon-card"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {/* ID in top left corner */}
                {id && (
                    <Typography
                        variant="caption"
                        sx={{
                            position: 'absolute',
                            top: 6,
                            left: 10,
                            fontSize: '1rem',
                            color: '#222',
                            letterSpacing: '1px',
                        }}
                    >
                        #{id}
                    </Typography>
                )}
                <h3>{name.toUpperCase()}</h3>
                {image && (
                    <Box sx={{
                        position: 'relative',
                        width: '96px',
                        height: '96px',
                        margin: '0 auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        {/* Glow effect as a pseudo-element */}
                        {hovered && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: '120px',
                                    height: '120px',
                                    borderRadius: '50%',
                                    background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
                                    zIndex: 0,
                                    pointerEvents: 'none',
                                    filter: 'blur(4px)',
                                }}
                            />
                        )}
                        <img
                            src={image}
                            alt={name}
                            style={{
                                width: '96px',
                                height: '96px',
                                borderRadius: '50%',
                                position: 'relative',
                                zIndex: 1,
                            }}
                        />
                    </Box>
                )}
            </Box>
        </Link>
    );
}

export default PokemonCard;