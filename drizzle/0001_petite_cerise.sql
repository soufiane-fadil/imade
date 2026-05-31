CREATE TABLE "article_slug_history" (
	"category_slug" text NOT NULL,
	"article_slug" text NOT NULL,
	"article_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "article_slug_history_category_slug_article_slug_pk" PRIMARY KEY("category_slug","article_slug")
);
--> statement-breakpoint
ALTER TABLE "article_slug_history" ADD CONSTRAINT "article_slug_history_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "article_slug_history_article_idx" ON "article_slug_history" USING btree ("article_id");