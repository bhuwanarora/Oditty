module Constant::StatusMessage
	InvalidLink					= "Invalid Link"
	LoginSuccess				= "Logged in successfully."
	AuthenticationFailed		= "Email and password doesn't match."
	VerifyEmail					= "Please verify your email address."
	EmailNotRegistered			= "Email not registered."
	EmailAlreadyRegistered		= "Email already registered."
	ActivateAccount				= "We have sent you an email with an activation link. Please activate your account. Wait for another 10mins if you didn't receive a mail."
	AnotherActivationRequest	= "Please activate your email account. We are sending you another mail."
	EmailConfirmed				= "Email Verified. We have recieved your request and will soon be able give access. Please bear with us."
	EmailConfirmationFailed		= "Email Confirmation Failed."
	PendingActivation			= "We will soon give access to your account. Please bear with us."
	PasswordRecoveryInitiated	= "A link to recover your password has been sent to the given email id."
	PasswordChangedSuccess	 	= "Password saved. Redirecting to home page."
	PasswordChangedFailure		= "Error while saving the new password. Please try again."
	SessionNotSet				= "Session not set properly error..."
	VerificationTokenExpired	= "Verification token invalid or expired. Please request it again "

	def self.waitlist_message count
		"You're at number " + count.to_s + " on Waiting list for oditty.me. We will mail you when you are good to go."
	end
end