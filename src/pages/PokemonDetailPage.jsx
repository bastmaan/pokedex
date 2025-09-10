import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Box, Button, Typography, Chip, Grid, Paper } from '@mui/material';

function PokemonDetailPage() {
    const { name } = useParams();
    const [pokemon, setPokemon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [evolutions, setEvolutions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
        console.log('Fetching details from:', url);
        fetch(url)
            .then(res => res.json())
            .then(data => {
                setPokemon(data);
                // Fetch species for evolution chain
                return fetch(data.species.url)
                    .then(res => res.json())
                    .then(speciesData => {
                        return fetch(speciesData.evolution_chain.url)
                            .then(res => res.json())
                            .then(evoData => {
                                // Parse evolution chain
                                const evoNames = [];
                                function traverse(chain) {
                                    if (chain && chain.species) {
                                        evoNames.push(chain.species.name);
                                        if (chain.evolves_to && chain.evolves_to.length > 0) {
                                            chain.evolves_to.forEach(traverse);
                                        }
                                    }
                                }
                                traverse(evoData.chain);
                                setEvolutions(evoNames);
                            });
                    });
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            })
            .finally(() => setLoading(false));
    }, [name]);

    // Type color mapping for chips
    const typeColors = {
        normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', electric: '#F7D02C', grass: '#7AC74C', ice: '#96D9D6',
        fighting: '#C22E28', poison: '#A33EA1', ground: '#E2BF65', flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A',
        rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC', dark: '#705746', steel: '#B7B7CE', fairy: '#D685AD'
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading Pokémon details.</div>;

    return (
        <Box sx={{ maxWidth: 600, margin: '2rem auto', padding: 2, background: 'rgba(126, 112, 8, 0.9)' , borderRadius: 2 }}>
            <Button 
                onClick={() => navigate('/pokemonpage')}
                variant="outlined"
                size="small"
                sx={{ color: 'white', borderColor: 'white', '&:hover': { background: 'rgba(255,255,255,0.1)', borderColor: 'white' }, mb: 2 }}
            >
                Back
            </Button>
            <Typography variant="h2" sx={{ textAlign: 'center', fontFamily: 'Pokemon Solid' }} gutterBottom>{pokemon.name.toUpperCase()}</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', my: 2 }}>
                <img src={pokemon.sprites.front_default} alt={pokemon.name} style={{ width: '100%', maxWidth: 200, height: 'auto' }} />
            </Box>
            <Typography variant="h5" mt={2} sx={{ display: 'inline', mr: 1 }}>Types:</Typography>
            <Box sx={{ display: 'inline-flex', gap: 1, mb: 2, verticalAlign: 'middle' }}>
                {pokemon.types.map(t => (
                    <Chip
                        key={t.type.name}
                        label={t.type.name.toUpperCase()}
                        onClick={() => navigate(`/pokemonpage?type=${t.type.name}`)}
                        clickable
                        sx={{
                            backgroundColor: typeColors[t.type.name] || '#888',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            letterSpacing: 1,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                            border: '2px solid white',
                            textShadow: '1px 1px 2px #333',
                            transition: 'transform 0.2s',
                            '&:hover': { transform: 'scale(1.1)', backgroundColor: typeColors[t.type.name] }
                        }}
                    />
                ))}
            </Box>
            <Typography variant="h5" mt={2}>Stats:</Typography>
            <Grid container spacing={2} sx={{ mb: 2, justifyContent: 'center' }}>
                <Grid item xs={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {pokemon.stats.filter(s => [
                        'hp', 'attack', 'defense'
                    ].includes(s.stat.name)).map(s => (
                        <Paper elevation={3} sx={{
                            p: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: 'rgba(255,255,255,0.15)',
                            color: 'white',
                            fontWeight: 'bold',
                            borderRadius: 2,
                            border: '1.5px solid #fff',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            letterSpacing: 1,
                            mb: 1,
                            transition: 'transform 0.2s',
                            minWidth: 200,
                            '&:hover': { transform: 'scale(1.05)', background: 'rgba(255,255,255,0.25)' }
                        }} key={s.stat.name}>
                            <span style={{ textTransform: 'uppercase' }}>{s.stat.name}</span>
                            <span>{s.base_stat}</span>
                        </Paper>
                    ))}
                </Grid>
                <Grid item xs={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {pokemon.stats.filter(s => [
                        'special-attack', 'special-defense', 'speed'
                    ].includes(s.stat.name)).map(s => (
                        <Paper elevation={3} sx={{
                            p: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: 'rgba(255,255,255,0.15)',
                            color: 'white',
                            fontWeight: 'bold',
                            borderRadius: 2,
                            border: '1.5px solid #fff',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            letterSpacing: 1,
                            mb: 1,
                            transition: 'transform 0.2s',
                            minWidth: 200,
                            '&:hover': { transform: 'scale(1.05)', background: 'rgba(255,255,255,0.25)' }
                        }} key={s.stat.name}>
                            <span style={{ textTransform: 'uppercase' }}>{s.stat.name}</span>
                            <span>{s.base_stat}</span>
                        </Paper>
                    ))}
                </Grid>
            </Grid>
            {evolutions.length > 1 && (
                <>
                    <Typography variant="h5" mt={2}>Evolutions:</Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1, alignItems: 'center', justifyContent: 'center',  }}>
                        {evolutions.map(evoName => (
                            <Link key={evoName} to={`/pokemon/${evoName}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <Button 
                                    variant={evoName === name ? 'contained' : 'outlined'}
                                    sx={{ 
                                        backgroundColor: evoName === name ? 'rgba(255,255,255,0.2)' : 'rgba(126, 112, 8, 0.9)',
                                        color: 'white',
                                        border: evoName === name ? '4px solid white' : '2px solid white',
                                        fontWeight: evoName === name ? 'bold' : 'normal',
                                        boxShadow: evoName === name ? '0 0 10px 2px white' : 'none',
                                        '&:hover': {
                                            backgroundColor: evoName === name ? 'rgba(255,255,255,0.3)' : 'rgba(126, 112, 8, 1)',
                                            color: 'white',
                                            border: evoName === name ? '4px solid white' : '2px solid white',
                                        }
                                    }}
                                >
                                    {evoName.toUpperCase()}
                                </Button>
                            </Link>
                        ))}
                    </Box>
                </>
            )}
        </Box>
    );
}

export default PokemonDetailPage; 