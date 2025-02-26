"use client";
import { useState, useEffect } from "react";
import { IProject, IComment } from "@/database/projectSchema";
import axios from "axios";
import parseCommentTime from "@/app/util/commentFormat";

export default function ProjectEntry({ params }: { params: { id: number } }) {
    const [project, setProject] = useState<IProject | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        /*
        Handles form submission by clearing form and appending comment
        */
        e.preventDefault();

        try {
            //get form submission event
            const formElement = e.target as HTMLFormElement;

            // Access values directly from the form elements
            const nameInput =
                formElement.querySelector<HTMLInputElement>(
                    'input[name="name"]'
                );
            const descriptionText =
                formElement.querySelector<HTMLTextAreaElement>(
                    'textarea[name="description"]'
                );

            // Explicitly cast e.target to HTMLFormElement
            const newComment: IComment = {
                user: nameInput?.value || "",
                comment: descriptionText?.value || "",
                time: new Date(),
            };
            //clear form data
            if (nameInput) nameInput.value = "";
            if (descriptionText) descriptionText.value = "";

            //Add comment to db and update UI
            const response = await axios.post(
                `/api/portfolio/${params.id}`,
                newComment
            );
            if (response.status === 200)
                setProject({
                    _id: project?._id || "",
                    title: project?.title || "",
                    description: project?.description || "",
                    url: project?.url || "",
                    image: project?.image || "",
                    comments: project
                        ? [...project.comments, newComment]
                        : [newComment],
                });
        } catch (err) {
            console.error(err);
        }
    }

    async function fetchProjectData() {
        /*
        This function requests data for a project specified by id in url
        */
        try {
            const response = await axios.get(`/api/portfolio/${params.id}`);
            if (response.status === 200) {
                const projectData: IProject = await response.data;
                setProject(projectData);
            } else {
                console.error("Failed to fetch project data");
            }
        } catch (error) {
            console.error("Error fetching project data:", error);
        }
    }

    useEffect(() => {
        fetchProjectData();
    }, [params.id]);

    return (
        <main>
            <center>
            {project ? (
                <>
                    <div className="blog-content">
                        <img className ="im" src={project?.image} />
                        <h2 className="blog-title">{project?.title}</h2>
                        <a href={project?.url}>See Project</a>
                        <div className="blog-description">
                            {project?.description}
                        </div>
                    </div>
                    <div className="comment-container">
                        <h2>Comments</h2>
                        {project?.comments.map((c) => (
                            <div className="comment-item">
                                <div className="comment-date">
                                    {parseCommentTime(c.time)}
                                </div>
                                <div className="comment-user">{c.user}</div>
                                <div className="comment-description">
                                    {c.comment}
                                </div>
                            </div>
                        ))}
                    </div>{" "}
                </>
            ) : (
                <p>Loading...</p>
            )}

            <form className="comment-form" onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Enter Name" />
                <textarea
                    id="description"
                    placeholder="Enter Comment"
                    name="description"
                ></textarea>
                <input type="submit" />
            </form>
            </center>
        </main>
    );
}
