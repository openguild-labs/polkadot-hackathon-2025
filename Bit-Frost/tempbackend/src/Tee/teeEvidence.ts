export async function generateTEEEvidence(): Promise<string> {
    try {
        // const evidence = await generateEvidence();
        return "SGX:TeeEvidence";
    } catch (error) {
        console.error('Failed to generate TEE evidence:', error);
        throw error;
    }
}