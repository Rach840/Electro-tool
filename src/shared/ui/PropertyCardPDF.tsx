'use client'

import { Page, Document, Font,Image } from '@react-pdf/renderer';
import handleDownload from './pdfButton';
import Html from "react-pdf-html";
import { Button } from '@/src/shared/ui/button';
import { Product } from "@/src/db/schema";
import { useEffect, useState } from "react";

export default function CreatePropertyDocument({ product}: {product: Product}) {
  const [url, setUrl] = useState();
  useEffect(() => {
    (async ()=> {
      const url = await (await fetch(product.image)).blob();
      setUrl(url)
    })()
  }, []);


  function CreateDocument() {
    Font.register({
      family: 'Roboto',
      fonts: [
        {
          fontStyle: 'normal',
          fontWeight: 400,
          format: 'ttf',
          src: `https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf`
        }
      ]
    });

    const stylesheet = {
      body: {
        fontFamily: "Roboto"
      }
    };

    const html = `
    <html lang="en">
    <body>
      <style>
        .property-card {
          display: flex;
          flex-direction: column;
        }
        .name{
         font-size: 1.5rem;
         margin-bottom: 5px;
        }
        .property-card p {
          margin: 0;
          font-size: 1rem;
        }
        .property-card .title {
          font-size: 1.2rem;
          font-weight: 500;
        }
        .flex {
          width: 600px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
        }
        .img {
          width: 300px;
          height: 400px;
        }

        .col {
          width: 250px;
        }
          .address{
          margin-bottom:20px
          }
        .col div{
        margin:10px 0;
        }
        .mb{
        margin-bottom:10px
        }
      </style>
      <div class="property-card">
        <h3 class="name" >${product.name}</h3>
             <div class="mb">
              <p class="title">Артикул ${product.id}</p>
            
            </div>
        <div class="flex">
       
          <div class="col">
            <div>
              <p class="title">Категория</p>
              <p>${product.category}</p>
            </div>
            <div>
              <p class="title">Остаток</p>
              <p>${product.stock} штуки</p>
            </div>
   
          </div>
          <div class='col'>
            <div>
              <p class="title">Цена</p>
              <p>${product.price} руб</p>
            </div>
       
                     <div>
              <p class="title">Производитель</p>
              <p>${product.manufacturer}</p>
            </div>

         
          </div>
        </div>
        <div>
             <div class='address'>
              <p class="title">Описание</p>
              <p>${product.description}</p>
            </div>

        </div>
      </div>
   
    </body>
    </html>`;


      return (
        <Document>
          <Page size='A4'>
            <Image style={{
              width: '300px',
              height: '300px',
              margin: '0 auto',
            }}
              src={url}
            />
            <Html stylesheet={stylesheet}>{html}</Html>
          </Page>
        </Document>
      );

  }
 

return <Button variant='outline' className='w-full' onClick={()=> handleDownload(CreateDocument)}> Скачать документ</Button>
    

}