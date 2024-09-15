-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE IF NOT EXISTS "race" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"createdDate" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedDate" timestamp with time zone DEFAULT now() NOT NULL,
	"name" varchar NOT NULL,
	"type" varchar NOT NULL,
	"date" timestamp NOT NULL,
	"eventId" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"createdDate" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedDate" timestamp with time zone DEFAULT now() NOT NULL,
	"firstName" varchar NOT NULL,
	"lastName" varchar NOT NULL,
	"username" varchar NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE("username"),
	CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"created_date" timestamp DEFAULT now() NOT NULL,
	"updated_date" timestamp DEFAULT now() NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "event" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"createdDate" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedDate" timestamp with time zone DEFAULT now() NOT NULL,
	"name" varchar NOT NULL,
	"startDate" timestamp with time zone NOT NULL,
	"endDate" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_race" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"createdDate" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedDate" timestamp with time zone DEFAULT now() NOT NULL,
	"userId" uuid NOT NULL,
	"raceId" uuid NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "race" ADD CONSTRAINT "FK_778abb6f582ac1bcbafa1101fc4" FOREIGN KEY ("eventId") REFERENCES "public"."event"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_race" ADD CONSTRAINT "FK_92663f5bb399f002a65b1ce47bf" FOREIGN KEY ("raceId") REFERENCES "public"."race"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_race" ADD CONSTRAINT "FK_cd3c86a1803bf148c121813d4f2" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

*/