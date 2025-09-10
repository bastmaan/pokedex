import React, { useState, useEffect } from 'react';
import PokemonCard from '../components/PokemonCard';
import { Box, Typography, Button, TextField, MenuItem, InputAdornment, Grid } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

function PokemonPage() {
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState('az');
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Check for ?type= query param
        const params = new URLSearchParams(location.search);
        const typeParam = params.get('type');
        if (typeParam) {
            setTypeFilter(typeParam);
        }
    }, [location.search]);

    useEffect(() => {
        fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
            .then(response => response.json())
            .then(async data => {
                // Fetch details for each pokemon to get the image and types
                const detailedPokemons = await Promise.all(
                    data.results.map(async (pokemon) => {
                        const res = await fetch(pokemon.url);
                        const details = await res.json();
                        return {
                            name: pokemon.name,
                            image: details.sprites.front_default,
                            types: details.types.map(t => t.type.name),
                            id: details.id
                        };
                    })
                );
                setPokemons(detailedPokemons);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, []);

    const sortedPokemons = [...pokemons].sort((a, b) => {
        if (sortOrder === 'az') {
            return a.name.localeCompare(b.name);
        } else if (sortOrder === 'za') {
            return b.name.localeCompare(a.name);
        } else if (sortOrder === 'id-asc') {
            return a.id - b.id;
        } else if (sortOrder === 'id-desc') {
            return b.id - a.id;
        } else {
            return 0;
        }
    });

    const filteredPokemons = sortedPokemons.filter(pokemon => {
        const matchesSearch = pokemon.name.toLowerCase().includes(search.toLowerCase());
        const matchesType = typeFilter === 'all' || pokemon.types.includes(typeFilter);
        return matchesSearch && matchesType;
    });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: 2, borderRadius: 2, height: '100px', marginBottom: 2 }} >
                <Typography variant="h1" sx={{ fontFamily: 'Pokemon Solid', fontSize: '3rem', color: 'white', letterSpacing: 3 }}>Your Personal Pokedex</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: 2, borderRadius: 2, marginBottom: 2 }}>
                <Button 
                    onClick={() => navigate('/')} 
                    variant="outlined"
                    size="small"
                    sx={{ color: 'white', borderColor: 'white', '&:hover': { background: 'rgba(255,255,255,0.1)', borderColor: 'white' }, mr: 2 }}
                >
                    Back
                </Button>
                <TextField 
                    select
                    label="Sort"
                    value={sortOrder}
                    onChange={e => setSortOrder(e.target.value)}
                    variant="outlined"
                    size="small"
                    SelectProps={{
                        MenuProps: {
                          disableScrollLock: true
                        }
                      }}
                    sx={{ minWidth: 120, color: 'white', marginRight: 2, 
                        '& .MuiInputBase-input': { color: 'white' },
                        '& .MuiInputLabel-root': { color: 'white' },
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                        '& .MuiSvgIcon-root': { color: 'white' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                        '& .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                        '& .MuiInputBase-root': { color: 'white' },
                        '& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                        '& .MuiInputLabel-root.Mui-focused': { color: 'white' },
                        '& .MuiMenu-paper': { color: 'white', backgroundColor: '#222' },
                        '& .MuiMenuItem-root': { color: 'white' },
                        '& .MuiMenuItem-root.Mui-selected': { color: 'white', backgroundColor: '#444' },
                        '& .MuiMenuItem-root:hover': { color: 'white', backgroundColor: '#333' }
                    }}
                >
                    <MenuItem value="az">A-Z</MenuItem>
                    <MenuItem value="za">Z-A</MenuItem>
                    <MenuItem value="id-desc">ID ↑</MenuItem>
                    <MenuItem value="id-asc">ID ↓</MenuItem>
                </TextField>
                <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Search Pokémon"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    sx={{ minWidth: 200, marginRight: 2, 
                        '& .MuiInputBase-input': { color: 'white' },
                        '& .MuiInputLabel-root': { color: 'white' },
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                        '& .MuiSvgIcon-root': { color: 'white' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                        '& .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                        '& .MuiInputBase-root': { color: 'white' },
                        '& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                        '& .MuiInputLabel-root.Mui-focused': { color: 'white' }
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField 
                    select
                    label="Filter by Type"
                    value={typeFilter}
                    onChange={e => setTypeFilter(e.target.value)}
                    variant="outlined"
                    size="small"
                    SelectProps={{
                        MenuProps: {
                          disableScrollLock: true
                        }
                      }}
                    sx={{ minWidth: 120, color: 'white', 
                        '& .MuiInputBase-input': { color: 'white' },
                        '& .MuiInputLabel-root': { color: 'white' },
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                        '& .MuiSvgIcon-root': { color: 'white' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                        '& .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                        '& .MuiInputBase-root': { color: 'white' },
                        '& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                        '& .MuiInputLabel-root.Mui-focused': { color: 'white' },
                        '& .MuiMenu-paper': { color: 'white', backgroundColor: '#222' },
                        '& .MuiMenuItem-root': { color: 'white' },
                        '& .MuiMenuItem-root.Mui-selected': { color: 'white', backgroundColor: '#444' },
                        '& .MuiMenuItem-root:hover': { color: 'white', backgroundColor: '#333' }
                    }}
                >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="fire">Fire</MenuItem>
                    <MenuItem value="water">Water</MenuItem>
                    <MenuItem value="grass">Grass</MenuItem>
                    <MenuItem value="electric">Electric</MenuItem>
                    <MenuItem value="psychic">Psychic</MenuItem>
                </TextField>
                {typeFilter !== 'all' && (
                    <Button
                        variant="outlined"
                        size="small"
                        sx={{ ml: 2, color: 'white', borderColor: 'white', '&:hover': { background: 'rgba(255,255,255,0.1)', borderColor: 'white' } }}
                        onClick={() => setTypeFilter('all')}
                    >
                        Clear Filter
                    </Button>
                )}
            </Box>
            <Grid container
                direction="row"
                spacing={2}
                sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    margin: 0,
                    width: '100%',
                }}>
                {filteredPokemons.map((pokemon) => (
                    <Grid item xs={12} md={4} lg={2.4} key={pokemon.name} sx={{ padding: 0 }}>
                        <PokemonCard name={pokemon.name} image={pokemon.image} types={pokemon.types} id={pokemon.id} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default PokemonPage;


