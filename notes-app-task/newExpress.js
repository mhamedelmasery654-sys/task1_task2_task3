const express = require( 'express' );
const fs = require( 'fs' );

const app = express();
app.use( express.json() );

const readNotes = () => {
    try {
        const data = fs.readFileSync( 'notes.json', 'utf8' );
        return JSON.parse( data || '[ ]' );
    } catch ( e ) {
        return [ ];
    }
};

const writeNotes = ( notes ) => {
    fs.writeFileSync( 'notes.json', JSON.stringify( notes, null, 2 ) );
};

app.get( '/notes', ( req, res ) => {
    res.json( readNotes() );
} );

app.post( '/notes', ( req, res ) => {
    const notes = readNotes();
    const newNote = { id: Date.now(), title: req.body.title, content: req.body.content };
    notes.push( newNote );
    writeNotes( notes );
    res.json( newNote );
} );

app.put( '/notes/:id', ( req, res ) => {
    const notes = readNotes();
    const index = notes.findIndex( n => n.id == req.params.id );

    if ( index !== -1 ) {
        notes[ index ] = { id: Number( req.params.id ), title: req.body.title, content: req.body.content };
        writeNotes( notes );
        res.json( notes[ index ] );
    } else {
        res.status( 404 ).json( { msg: 'not found' } );
    }
} );

app.patch( '/notes/:id', ( req, res ) => {
    const notes = readNotes();
    const index = notes.findIndex( n => n.id == req.params.id );

    if ( index !== -1 ) {
        notes[ index ] = { ...notes[ index ], ...req.body };
        writeNotes( notes );
        res.json( notes[ index ] );
    } else {
        res.status( 404 ).json( { msg: 'not found' } );
    }
} );

app.delete( '/notes/:id', ( req, res ) => {
    let notes = readNotes();
    notes = notes.filter( n => n.id != req.params.id );
    writeNotes( notes );
    res.json( { msg: 'deleted' } );
} );

app.listen( 3000, () => console.log( 'running on 3000' ) );
