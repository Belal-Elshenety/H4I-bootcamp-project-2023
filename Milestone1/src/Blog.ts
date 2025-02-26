type Blog = {
    title : string;
    date : Date;
    description : string;
    slug : string;
}

const blogs: Blog[] = [
	{
		title: "My new blog",
		date: new Date("2023-10-22"),
		description: "I have made a new blog using Hack4Impact bootcamp",
        slug: "../Blog/blog_entry1.html"
	},
	{
		title: "My linear analysis homework",
		date: new Date("2023-10-22"),
		description: "I have really with understanding vector spaces, subspaces, and spans",
        slug: "../Blog/blog_entry2.html"
	},
];

function appendBlogsToContainer(blogs: Blog[]): void {
    const container = document.getElementById("blog-container");

    if (container) {
        blogs.forEach((blog) => {
            const blogElement = document.createElement('div');
            blogElement.innerHTML = `
                <h2>${blog.title}</h2>
                <p>Date: ${blog.date}</p>
                <p>${blog.description}</p>
                <a href="${blog.slug}"><button class="blog-btn">Read More</button></a>
            `;

            container.appendChild(blogElement);
        });
    } else {
        console.error('Container not found.');
    }
}

appendBlogsToContainer(blogs);