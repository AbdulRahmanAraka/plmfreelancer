type AssignFreelancerInput = {
  projectId: string;
  freelancerId: string;
  adminId: string;
};

export async function assignFreelancerToProject(input: AssignFreelancerInput) {
  return {
    success: true,
    message: "Freelancer assignment service placeholder",
    input,
  };
}
