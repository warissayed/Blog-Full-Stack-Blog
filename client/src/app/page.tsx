import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="grid grid-cols-grid-template-columnsMain gap-2 p-2 mb-10  ">
        <div className="w-full">
          <img
            src="https://images.unsplash.com/photo-1723737347273-5ae32dcdb5d3?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Test Img"
            className="max-w-full"
          />
        </div>

        <div>
          <h2 className="text-4xl font-bold">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptates
            nobis,
          </h2>
          <div className="flex flex-col my-3">
            <div className="flex items-center">
              <img
                src="https://avatars.githubusercontent.com/u/119447310?s=400&u=58b6fd34401479669939e783be720049dc817d53&v=4"
                alt="img"
                className="h-9 w-9"
              />
              <Link href={"/"} className="text-xl">
                {/* <h1>this is something</h1> */}
                This is something
              </Link>
            </div>

            <time dateTime="2023-01-01">January 1, 2023</time>
          </div>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus</p>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rem cumque
            fugit enim voluptatibus obcaecati odio ut. Quibusdam autem fugiat
            aperiam omnis laborum illo saepe ad eaque eius ab! Provident,
            laudantium?
          </p>
        </div>
      </div>
    </>
  );
}
