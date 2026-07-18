import QuestionForm from "@/components/QuestionForm";

export default function AskQuestionPage() {
    return (
        <main className="container mx-auto max-w-5xl px-4 pb-20 pt-32">
            <h1 className="mb-8 text-4xl font-bold">
                Ask a public question
            </h1>

            <QuestionForm />
        </main>
    );
}