const a = document.getElementById("Sobre");

function ShowAboutUs(){
    const AboutUs = document.createElement("h3");
    const Content = "Glider foi criado como tananannana";
    const Text = document.createTextNode(Content);
    AboutUs.appendChild(Text);


    const Glider_gif = document.getElementById("Glider_gif");
    document.body.insertBefore(AboutUs, Glider_gif);
}

a.addEventListener("click", ShowAboutUs);