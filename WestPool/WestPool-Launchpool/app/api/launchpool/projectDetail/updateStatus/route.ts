import { NextRequest, NextResponse } from "next/server";
import prismaClient from "@/prisma";
import { ProjectStatus } from "@prisma/client";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    const { projectId } = body;

    console.log("Request body:", body);
    console.log("Project ID received:", projectId);

    const currentDate = new Date();
    console.log("Current date:", currentDate);

    const projects = await prismaClient.project.findMany({
      where: { id: projectId },
    });

    if (projects.length === 0) {
      console.log(`Project with ID ${projectId} not found.`);
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    const project = projects[0];
    console.log("Project found:", project);

    let projectStatus: ProjectStatus = ProjectStatus.Upcoming;

    if (
      currentDate >= new Date(project.fromDate) &&
      currentDate <= new Date(project.toDate)
    ) {
      projectStatus = ProjectStatus.Ongoing;
    } else if (currentDate > new Date(project.toDate)) {
      projectStatus = ProjectStatus.Completed;
    }

    console.log("Determined project status:", projectStatus);

    const updatedProject = await prismaClient.project.update({
      where: { id: projectId },
      data: { projectStatus },
    });

    console.log("Updated project data:", updatedProject);

    return NextResponse.json(
      { success: true, data: updatedProject },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error occurred:", error);
    return NextResponse.json({ success: false, error: error }, { status: 400 });
  }
}
