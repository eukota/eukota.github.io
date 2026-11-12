<!-- DRAFT: first pass written by Claude from the project READMEs. Rewrite in your own voice before publishing. -->
# Interviewing with AI

AI-assisted technical interviews are a format where you work with an AI and are judged on how well you direct it as well as on what you build. This page collects the material I've put together for both sides of that interview.

## Candidate Guide

How to perform well in an AI-assisted interview. The guide has a chapter of strategy for each phase (requirements and design, implementation, and testing) and a set of principles that apply throughout: you actively direct the AI, you think out loud, you work through the problem with the AI instead of handing it over, you steer the interview toward a problem you can finish, and you ask the AI to explain things by comparing them to ideas you already know. It also covers how to read AI responses critically and includes worked examples that contrast weak and strong prompts.

There's also a Claude plugin, interview-skills, with short skills that put these habits into practice during an interview. See [Claude Marketplace](claude-marketplace.md).

[Candidate guide on GitHub](https://github.com/eukota/ai-projects/tree/main/projects/interviewing-with-ai/candidate-guide)

## Interviewer Rubric

How to evaluate a candidate in an AI-assisted interview. It has two parts. The first is the candidate's AI experience, discussed early in the interview. The second is how they work through the problem, observed across requirements and design, implementation and testing, which is where their claimed experience gets checked. Each dimension is rated low, medium or high, and the same core principles the candidate guide teaches serve as the lens for judging the second part.

[Interviewer rubric on GitHub](https://github.com/eukota/ai-projects/tree/main/projects/interviewing-with-ai/interviewer-rubric)

## Question Bank

Full-stack practice exercises for the hands-on build portion of an interview class. Each one is meant to practice interview behavior: clarifying requirements, directing the AI, explaining decisions, reviewing generated code and verifying the result. There are small problems that are solved twice with different approaches so you can compare them, medium problems that are solved once and then changed to expose an assumption, and an exercise that starts from a supplied backend.

It's partly written. A couple of exercises are complete and the rest are outlines.

[Question bank on GitHub](https://github.com/eukota/ai-projects/tree/main/projects/interviewing-with-ai/question-bank)

## AI Interview Framework

!!! warning "Work in progress"
    This is in the design stage. Nothing here is built yet.

An open-source framework for practicing AI-assisted interviews. A live interviewer agent runs the session while the candidate directs their own AI, and afterward an evaluator scores a timeline of what happened against a rubric.

[Framework design on GitHub](https://github.com/eukota/ai-projects/tree/main/projects/ai-interview-framework)
