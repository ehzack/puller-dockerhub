# Contributing to PULLER DOCKERHUB

Thank you for your interest in contributing to PULLER DOCKERHUB! We welcome improvements, fixes, and new features from the community. This document outlines how you can help.

## Table of Contents

1. [Reporting Bugs](#reporting-bugs)
2. [Suggesting Enhancements](#suggesting-enhancements)
3. [Pull Request Process](#pull-request-process)
4. [Code Style and Guidelines](#code-style-and-guidelines)
5. [Writing Tests](#writing-tests)
6. [Documentation](#documentation)
7. [Code Reviews](#code-reviews)
8. [Release Process](#release-process)
9. [Getting Help](#getting-help)

## Reporting Bugs

If you find a bug, please open an issue on GitHub:

1. Ensure the bug was not already reported by searching existing issues.
2. Provide a clear and descriptive title.
3. Describe the exact steps to reproduce the issue.
4. Include relevant logs, screenshots, or error messages.
5. Specify your environment (OS, Docker version, PULLER DOCKERHUB version).

## Suggesting Enhancements

Feature requests are always welcome! To suggest an enhancement:

1. Search open issues to avoid duplicates.
2. Open a new issue labeled as **enhancement**.
3. Provide a detailed description of the proposed feature.
4. Explain the motivation and potential use cases.

## Pull Request Process

1. Fork the repository and clone your fork.
2. Create a new branch:  
   ```bash
   git checkout -b feature/my-feature
   ```
3. Make your changes on the feature branch.
4. Ensure all tests pass:  
   ```bash
   docker-compose up --build --abort-on-container-exit puller
   ```
5. Commit your changes with clear, descriptive messages:  
   ```bash
   git commit -m "Add feature X to trigger endpoint"
   ```
6. Push to your fork and open a Pull Request against `main`.
7. Fill out the Pull Request template, linking any related issues.

## Code Style and Guidelines

- Follow [PSR-12](https://www.php-fig.org/psr/psr-12/) for PHP code style (if applicable).
- Use **snake_case** for file names and **camelCase** for variables and functions.
- Keep lines under 100 characters.
- Include comments for complex logic.

## Writing Tests

- Write unit tests for new features and bug fixes.
- Place test files next to the code they cover.
- Aim for high coverage, especially around edge cases.
- Run tests locally before submitting a PR.

## Documentation

- Keep documentation up-to-date in the `/docs` directory.
- Document new endpoints, parameters, and configuration options.
- Use clear examples and code snippets where applicable.

## Code Reviews

- Be respectful and constructive when reviewing others’ code.
- Focus on code quality, consistency, and clarity.
- If you request changes, explain why and suggest improvements.

## Release Process

- Once a PR is approved, maintainers will merge and tag a new release.
- Update `CHANGELOG.md` with notable changes.
- Ensure Docker image builds and pushes to Docker Hub.

## Getting Help

If you have questions or need assistance, please open an issue with the `question` label or reach out on our Slack channel.

Thank you for helping make PULLER DOCKERHUB better!
