module Constant::Time
	
	Year 				= "year"
	Month 				= "month"
	Date 				= "date"
	Hour 				= "hour"
	Minute 				= "minute"
	Second 				= "second"
	Format_default 		= [Year, Month, Date]
	
	Months 				= ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
	MonthsAbbreviated 	= ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
	

	### NOt used
	Day 				= ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
	DayAbbreviated 		= ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"]

	OneMin				= 60
	OneHour				= 60*OneMin
	OneDay				= 24*OneHour
	OneWeek				= 7 *OneDay
	OneMonth			= 30*OneDay
end