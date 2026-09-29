
export enum TechStack {
    "frontend" = "frontend",
    "backend" = "backend",
    "full-stack" = "full-stack"
}

export interface ProjectsTypes {
    id: number,
    project_name: string,
    /** Short blurb. Also the <meta name="description"> for the detail page, so keep it under ~155 chars. */
    description: string,
    img_path: string,
    technologies: string[],
    github_link: string,
    demo_link: string,
    tech_stack: TechStack,

    /*
     * Long-form case-study fields. All optional: a project renders exactly as it did
     * before until they are filled in.
     *
     * These exist because the detail pages were thin — one short paragraph and an icon
     * row is very little for a crawler to index or a reader to judge the work by. The
     * fix is more written content, not a different file format: the app already serves
     * fully rendered HTML for these URLs, so markdown would emit identical markup.
     *
     * Keep this in sync with ProjectsSchema in core/schemas/projectsSchema.ts — the two
     * are hand-maintained in parallel and drift silently if only one is edited.
     */

    /** Body paragraphs. Rendered as one <p> each, in order. */
    summary?: string[],
    /** Notable technical decisions or features. Rendered as a <ul>. */
    highlights?: string[],
    /** e.g. 'Solo developer'. */
    role?: string,
    /** Year of the most recent work on the project. */
    year?: number,

    /**
     * Full stack, shown only on the detail page. `technologies` above stays the
     * headline set because it also drives filter matching, so it is kept short
     * enough to read on a grid card.
     *
     * Falls back to `technologies` when absent. Every entry must name a file in
     * src/assets/icons/tech/ — projects.model.spec.ts enforces that.
     */
    technologies_detail?: string[],

    /**
     * The one technology the project is built around, used for the cover band on
     * the detail page. Cannot be derived from `technologies[0]`: that is
     * `nodedotjs` for the Express and NestJS projects, whose real core is the
     * framework, not the runtime.
     */
    core_tech?: string,

    /*
     * Redesign fields. Like the case-study fields above, all optional and mirrored
     * in ProjectsSchema.
     */

    /** Shown in the homepage "Selected work" section. */
    featured?: boolean,
    /**
     * Position within its stack in the default sort, lowest first. Projects without
     * one follow, ordered by `core_tech` priority and then by year.
     */
    order?: number,
    /**
     * The app only makes sense on the visitor's own machine, so there is no hosted
     * demo. Drives the "Runs locally · no demo" status. Demo status itself is not
     * stored: ProjectService.demoStatus() derives it from this and `demo_link`.
     */
    runs_locally?: boolean,
    /** Why there is no live demo, shown in the detail page's callout. */
    no_demo_reason?: string,
    /** A sibling project to cross-link, e.g. the API behind a dashboard. */
    related?: {
        id: number,
        /** Link text, e.g. 'See the API'. */
        label: string
    }
}
