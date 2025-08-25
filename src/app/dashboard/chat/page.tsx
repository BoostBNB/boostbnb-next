"use client";

import { useState, useActionState, useEffect, useRef } from "react";
import { getCohostResponse } from "@/actions/audit";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";

const initialState = { success: false, error: "" };

interface ChatMessage {
	role: "user" | "assistant";
	content: string;
	timestamp: Date;
}

const ChatPage = () => {
	const [message, setMessage] = useState("");
	const [userInitials, setUserInitials] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const chatContainer = useRef<HTMLDivElement>(null);

	const [form, formAction, pending] = useActionState(
		getCohostResponse,
		initialState
	);

	const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
		{
			role: "assistant",
			content:
				"Hello! I'm your Cohost AI assistant. How can I help optimize your Airbnb listings today?",
			timestamp: new Date(),
		},
	]);

	useEffect(() => {
		const getUserInitials = async () => {
			const supabase = await createClient();
			const {
				data: { user },
				error,
			} = await supabase.auth.getUser();
			setUserInitials(user?.email?.toUpperCase()[0] ?? "U");
		};

		getUserInitials();
	}, []);


	useEffect(() => {
		setTimeout(() => {
			if (chatContainer.current) { 
				chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
			}
		}, 100)
	}, [isLoading]);

	
	useEffect(() => {
		// Check if form submission returned a result
		if (form?.success && form?.result) {
			setChatHistory([
				...chatHistory,
				{
					role: "assistant",
					content: form.result,
					timestamp: new Date(),
				},
			]);
		} else if (form?.error) {
			setChatHistory([
				...chatHistory,
				{
					role: "assistant",
					content: `Error: ${form.error}`,
					timestamp: new Date(),
				},
			]);
		}

		setIsLoading(false);
	}, [form]);

	function handleSubmit() {
		if (!message.trim()) return;

		// Add user message to chat
		setChatHistory([
			...chatHistory,
			{
				role: "user",
				content: message,
				timestamp: new Date(),
			},
		]);

		setIsLoading(true);
		setMessage("");
	}

	return (
		<div className="h-screen p-4 lg:p-10">
			<div className="flex h-full flex-col rounded-xl border-1 border-gray-300 bg-gray-100 shadow-lg">
				<div className="border-b-1 border-gray-300 p-4">
					<h2 className="text-xl font-bold">Cohost AI Assistant</h2>
					<p className="text-sm text-gray-500">
						Get AI-powered help optimizing your listings and
						managing guest interactions
					</p>
				</div>

				<div ref={chatContainer} className="flex min-h-[400px] flex-grow overflow-y-auto p-4">
					<div className="chat flex w-full flex-col gap-4">
						{chatHistory.map((message, i) =>
							message.role === "user" ? (
								<div key={i} className="flex items-end justify-end w-full last:pb-5">
									<div>
										<div className="chat-header opacity-50">
											You
											<time className="text-xs ml-2 opacity-50">
												{message.timestamp.toLocaleTimeString()}
											</time>
										</div>
										<div className="bg-blue-400 rounded-md p-2">
											{message.content}
										</div>
									</div>
									<div className="ml-3 bg-red-300 w-10 h-10 text-center rounded-full">
										<span className="relative top-1.5 text-lg text-bold">
											{userInitials}
										</span>
									</div>
								</div>
							) : (
								<div key={i} className="flex items-end w-full last:pb-5">
									<Image
										alt="Cohost AI"
										src="/favicon.png"
										width={40}
										height={40}
										className="border-1 mr-3 text-center rounded-full"
									/>
									<div className="max-w-150">
										<div className="chat-header opacity-50">
											Cohost AI
											<time className="text-xs ml-2 opacity-50">
												{message.timestamp.toLocaleTimeString()}
											</time>
										</div>
										<div className="bg-blue-400 rounded-md p-2">
											{message.content}
										</div>
									</div>
								</div>
							)
						)}

						{isLoading && (
							<div className="flex items-end w-full pb-5">
								<Image
									alt="Cohost AI"
									src="/favicon.png"
									width={40}
									height={40}
									className="border-1 mr-3 text-center rounded-full"
								/>
								<div className="flex max-w-150 bg-blue-400 rounded-md h-10 items-center p-2">
									<div className="w-5 h-5 mx-1 animate-bounce bg-white rounded-full"></div>
									<div className="w-5 h-5 mx-1 animate-bounce bg-white rounded-full"></div>
									<div className="w-5 h-5 mx-1 animate-bounce bg-white rounded-full"></div>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* <!-- Input area --> */}
				<form
					action={formAction}
					className="flex items-center gap-2 border-t-1 border-gray-300 p-4"
					onSubmit={handleSubmit}
				>
					<input
						name="prompt"
						type="text"
						placeholder="Type your question or request..."
						className="input input-bordered flex-1"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						disabled={isLoading}
					/>
					<button
						type="submit"
						className="btn btn-primary"
						disabled={isLoading || !message.trim()}
					>
						{isLoading ? (
							<span className="loading loading-spinner loading-sm"></span>
						) : (
							<p>Send</p>
						)}
					</button>
				</form>
			</div>
		</div>
	);
};

export default ChatPage;
