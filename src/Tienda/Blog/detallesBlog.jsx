import React from 'react';
import './blog.css'

export default function detallesBlog() {
  return (
    <>
      <main >
        <Card className="main-blog">
          <Card.Img variant="top" src="holder.js/100px180" />
          <Card.Body>
            <Card.Title className="titulo-blog">Blog muy epico sobre musica</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </Card.Text>
          </Card.Body>
        </Card>
        
      </main>
    </>
  );
}
