"use client";
import { invoke } from "@tauri-apps/api/core";
import { GlobeLock, LockKeyholeIcon, UserIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

export default function Home() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [vpnPassword, setVpnPassword] = useState("");
	const [remember, setRemember] = useState(true);
	const [vpn, setVpn] = useState(false);
	const [loading, setLoading] = useState(false);

	// 新增: flow_execution_key
	const [flowExecutionKey, setFlowExecutionKey] = useState("");

	const [captchaBase64, setCaptchaBase64] = useState("");
	const [captchaText, setCaptchaText] = useState("");

	const router = useRouter();

	const fetchCaptcha = useCallback(async () => {
		try {
			const data = await invoke<{
				captcha_base64: string;
				flow_execution_key: string;
			}>("get_captcha_and_flow_key");

			setCaptchaBase64(data.captcha_base64);
			setFlowExecutionKey(data.flow_execution_key);
		} catch (err) {
			console.error("获取验证码失败", err);
			toast.error("获取验证码失败");
		}
	}, []);

	useEffect(() => {
		const checkCookieAndState = async () => {
			const ok = await invoke<boolean>("check_cookie_and_state");
			if (ok) {
				router.push("/main/info");
				toast("已自动登录");
			} else {
				setUsername(localStorage.getItem("Username") || "");
				setPassword(localStorage.getItem("Password") || "");
				setVpnPassword(localStorage.getItem("VpnPassword") || "");
				fetchCaptcha();
			}
		};
		checkCookieAndState();
	}, [fetchCaptcha, router]);

	const handleRememberChange = (checked: boolean) => {
		if (checked) {
			localStorage.setItem("Username", username);
			localStorage.setItem("Password", password);
			localStorage.setItem("VpnPassword", vpnPassword);
		} else {
			localStorage.removeItem("Username");
			localStorage.removeItem("Password");
			localStorage.removeItem("VpnPassword");
		}
	};

	const handleLogin = async () => {
		if (!captchaText) {
			toast("请输入验证码");
			return;
		}

		if (!flowExecutionKey) {
			toast.error("flowExecutionKey 缺失，请刷新验证码");
			return;
		}

		setLoading(true);

		try {
			const text = await invoke<string>("manual_login", {
				username,
				vpnPassword: vpn ? vpnPassword : password,
				oaPassword: password,
				captcha: captchaText,
				flowExecutionKey, // ← 新加入
			});

			if (text === "登录成功") {
				if (remember) handleRememberChange(true);
				router.push("/main/info");
			} else if (text.includes("验证码")) {
				await fetchCaptcha();
			}

			toast(text);
		} catch (_) {
			toast.error("登录失败");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card className="w-full max-w-sm fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
			<CardContent>
				<form>
					<div className="flex flex-col gap-6">
						<div className="grid gap-2 ">
							<Label htmlFor="student-id">
								<UserIcon />
								Student ID
							</Label>
							<Input
								id="student-id"
								type="text"
								placeholder="Student ID"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
						</div>

						{vpn && (
							<div className="grid gap-2">
								<Label
									htmlFor="vpn-password"
									className="flex items-center gap-1"
								>
									<GlobeLock /> VPN Password
								</Label>
								<Input
									id="vpn-password"
									type="password"
									placeholder="VPN Password"
									value={vpnPassword}
									onChange={(e) => setVpnPassword(e.target.value)}
								/>
							</div>
						)}

						<div className="grid gap-2">
							<Label htmlFor="password" className="flex items-center gap-1">
								<LockKeyholeIcon /> Password
							</Label>
							<Input
								id="password"
								type="password"
								placeholder="Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>

						{/* 验证码部分 */}
						<div className="flex items-center gap-3">
							<div className="relative">
								{captchaBase64 ? (
									<button
										type="button"
										className="w-64 h-12 flex items-center justify-center border rounded cursor-pointer"
										onClick={fetchCaptcha}
									>
										<Image
											src={captchaBase64}
											alt="captcha"
											className="w-full h-full object-contain"
											width={120}
											height={48}
											priority
										/>
									</button>
								) : (
									<div className="w-32 h-12 flex items-center justify-center border rounded bg-gray-100">
										<Spinner />
									</div>
								)}
							</div>

							<Input
								id="captcha"
								type="text"
								placeholder="输入验证码"
								value={captchaText}
								onChange={(e) => setCaptchaText(e.target.value)}
							/>
						</div>
					</div>
				</form>
			</CardContent>

			<div className="flex flex-row gap-2 items-center justify-between ml-6 mr-6">
				<div className="flex items-start gap-3">
					<Checkbox
						id="remember"
						defaultChecked={remember}
						onCheckedChange={() => setRemember(!remember)}
					/>
					<Label htmlFor="remember">记住密码</Label>
				</div>
				<div className="flex items-start gap-3">
					<Checkbox
						id="vpn"
						defaultChecked={vpn}
						onCheckedChange={() => setVpn(!vpn)}
					/>
					<Label htmlFor="vpn">VPN与教务系统密码不一致</Label>
				</div>
			</div>

			<CardFooter className="flex-row gap-2">
				<Button className="w-full" onClick={handleLogin} disabled={loading}>
					{loading ? <Spinner /> : "登录"}
				</Button>
			</CardFooter>
		</Card>
	);
}
