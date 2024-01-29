// app.js
const Proteins = ["Cell-Based", "Plant-Based", "Microbial"];
const Products = ["Meat", "Dairy"];
const Topics = ["Business", "Sci-Tech"];
const Regions = ["International"];
const Flags = ["Press Release"];
const Directorys = ["1172", "7349", "8523", "3654", "4521"];

// React quill
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "color",
];

const App = () => {
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    company: "",
    company_url: "",
    proteins: [],
    products: [],
    topics: [],
    regions: [],
    flags: [],
    directorys: [],
    images: "",
    featured_image: "",
    additional_images: "",
    markdownContent: null,
  });

  const handleInputChange = (fieldName, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleCheckboxChange = (group, value) => {
    setFormData((prevData) => {
      if (prevData[group].includes(value)) {
        // If the value is already in the array, remove it
        return {
          ...prevData,
          [group]: prevData[group].filter((item) => item !== value),
        };
      } else {
        // If the value is not in the array, add it
        return {
          ...prevData,
          [group]: [...prevData[group], value],
        };
      }
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // You can handle the form submission logic here
    console.log("Form submitted with data:", formData);

    // Generate frontmatter and Markdown content based on form data
    const frontmatter = `
    ---
    title: ${formData.title}
    date: ${new Date().toISOString()}
    slug: ${formData.title.split(" ").join("-").toLowerCase()}
    company_name: ${formData.company}
    company_link: ${formData.company_url}
    description: ${formData.description}
    proteins: [${formData.proteins}]
    products: [${formData.products}]
    topics: [${formData.topics}]
    regions: [${formData.regions}]
    flags: [${formData.flags}]
    directory: [${formData.directorys}]
    images: [${formData.featured_image}]
    featured_image: ${formData.featured_image}
    additional_images: [${formData.featured_image}]
      - src: [${formData.additional_images}]
        caption: ""
        alt: ""
        title: ""
    draft: false
    uuid: ${Math.floor(1000 + Math.random() * 9000)}
    ---
    `;

    // Convert HTML to Markdown using remark-html-to-md library
    var turndownService = new TurndownService();
    var markdown = turndownService.turndown(formData.markdownContent);

    // Generate Markdown content based on form data
    const markdownContent = `${frontmatter}

    ${markdown}
    `;

    // Create a ContentBase64 from the Markdown content
    const contentBase64 = btoa(markdownContent);

    const accessToken = "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"; // Replace 'YOUR_ACCESS_TOKEN' with your actual GitHub personal access token
    const username = "ronopixels"; // Replace with the owner of the target repository
    const repo = "sync-private-repo"; // Replace with the name of the target repository
    const mainBranchSHAToken = "86deb64acebd853c2efb931c897b9a4d8a9c5da7"; // Replace with the commit SHA of the 'main' branch you want to branch from

    // Generate Unique Branch Name & PR Title
    const prTitle = formData.title;
    const branchName = formData.title.split(" ").join("-").toLowerCase();

    // Save the path name Where .MD File Uploaded
    const filePath = "content/newswire";

    // Base URL for GitHub API
    const apiUrl = `https://api.github.com/repos/${username}/${repo}`;

    try {
      // Step 1: Create a new branch
      const branchResponse = await fetch(`${apiUrl}/git/refs`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ref: `refs/heads/${branchName}`, // Replace with a unique branch name
          sha: mainBranchSHAToken,
        }),
      });

      const branchData = await branchResponse.json();
      console.log("Create a new branch", branchData);

      // Step 2: Upload the file to the new branch
      const uploadResponse = await fetch(
        `${apiUrl}/contents/${filePath}/${branchName}/index.md`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: "Upload .md file to new branch",
            content: contentBase64,
            branch: branchName, // Replace with the branch name you created
          }),
        }
      );

      const uploadData = await uploadResponse.json();
      console.log("Upload the file to the new branch", uploadData);

      // Step 3: Create a pull request
      const pullRequestResponse = await fetch(`${apiUrl}/pulls`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: prTitle,
          head: branchName, // Replace with the branch name you created
          base: "main", // Replace with the branch you want to merge into
        }),
      });

      const pullRequestData = await pullRequestResponse.json();
      console.log("Pull request created:", pullRequestData);
      alert("Pull request created successfully...");
    } catch (error) {
      console.error("Error creating pull request:", error);
    }
  };

  return (
    <section className="container mx-auto flex py-24 bg-slate-100">
      <div className="w-2/4 px-8">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="title"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Title"
              required
              onChange={(e) => handleInputChange("title", e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="description"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Description
            </label>
            <input
              id="description"
              required
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Description"
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>

          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="company"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Company
              </label>
              <input
                type="text"
                id="company"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Proteinreport"
                required
                onChange={(e) => handleInputChange("company", e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="company_url"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Company URL
              </label>
              <input
                type="url"
                id="company_url"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="proteinreport.com"
                required
                onChange={(e) =>
                  handleInputChange("company_url", e.target.value)
                }
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Proteins
            </label>
            <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex">
              {Proteins.map((protein, index) => (
                <li
                  key={protein}
                  className={`w-full border-b border-gray-200 sm:border-b-0 ${
                    index < Proteins.length - 1 && "sm:border-r"
                  }`}
                >
                  <div className="flex items-center ps-3">
                    <input
                      id={protein}
                      name="proteins"
                      type="checkbox"
                      value={protein}
                      onChange={(e) =>
                        handleCheckboxChange("proteins", e.target.value)
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor={protein}
                      className="w-full py-3 ms-2 text-sm font-medium text-gray-900"
                    >
                      {protein}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Products
            </label>
            <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex">
              {Products.map((product, index) => (
                <li
                  key={product}
                  className={`w-full border-b border-gray-200 sm:border-b-0 ${
                    index < Products.length - 1 && "sm:border-r"
                  }`}
                >
                  <div className="flex items-center ps-3">
                    <input
                      id={product}
                      name="products"
                      type="checkbox"
                      value={product}
                      onChange={(e) =>
                        handleCheckboxChange("products", e.target.value)
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor={product}
                      className="w-full py-3 ms-2 text-sm font-medium text-gray-900"
                    >
                      {product}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Topics
            </label>
            <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex">
              {Topics.map((topic, index) => (
                <li
                  key={topic}
                  className={`w-full border-b border-gray-200 sm:border-b-0 ${
                    index < Topics.length - 1 && "sm:border-r"
                  }`}
                >
                  <div className="flex items-center ps-3">
                    <input
                      id={topic}
                      name="topics"
                      type="checkbox"
                      value={topic}
                      onChange={(e) =>
                        handleCheckboxChange("topics", e.target.value)
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor={topic}
                      className="w-full py-3 ms-2 text-sm font-medium text-gray-900"
                    >
                      {topic}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Regions
            </label>
            <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex">
              {Regions.map((region, index) => (
                <li
                  key={region}
                  className={`w-full border-b border-gray-200 sm:border-b-0 ${
                    index < Regions.length - 1 && "sm:border-r"
                  }`}
                >
                  <div className="flex items-center ps-3">
                    <input
                      id={region}
                      name="regions"
                      type="checkbox"
                      value={region}
                      onChange={(e) =>
                        handleCheckboxChange("regions", e.target.value)
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor={region}
                      className="w-full py-3 ms-2 text-sm font-medium text-gray-900"
                    >
                      {region}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Flags
            </label>
            <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex">
              {Flags.map((flag, index) => (
                <li
                  key={flag}
                  className={`w-full border-b border-gray-200 sm:border-b-0 ${
                    index < Flags.length - 1 && "sm:border-r"
                  }`}
                >
                  <div className="flex items-center ps-3">
                    <input
                      id={flag}
                      name="flags"
                      type="checkbox"
                      value={flag}
                      onChange={(e) =>
                        handleCheckboxChange("flags", e.target.value)
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor={flag}
                      className="w-full py-3 ms-2 text-sm font-medium text-gray-900"
                    >
                      {flag}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Directorys
            </label>
            <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex">
              {Directorys.map((directory, index) => (
                <li
                  key={directory}
                  className={`w-full border-b border-gray-200 sm:border-b-0 ${
                    index < Directorys.length - 1 && "sm:border-r"
                  }`}
                >
                  <div className="flex items-center ps-3">
                    <input
                      id={directory}
                      name="directorys"
                      type="checkbox"
                      value={directory}
                      onChange={(e) =>
                        handleCheckboxChange("directorys", e.target.value)
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor={directory}
                      className="w-full py-3 ms-2 text-sm font-medium text-gray-900"
                    >
                      {directory}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <label
              htmlFor="images"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Images URL
            </label>
            <input
              type="url"
              id="images"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter images URLs separated by commas"
              required
              onChange={(e) => handleInputChange("images", e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="featured_image"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Featured Image URL
            </label>
            <input
              type="url"
              id="featured_image"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Featured image url"
              required
              onChange={(e) =>
                handleInputChange("featured_image", e.target.value)
              }
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="additional_images"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Featured Image URL
            </label>
            <input
              type="url"
              id="additional_images"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter additional images URLs separated by commas"
              required
              onChange={(e) =>
                handleInputChange("additional_images", e.target.value)
              }
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="title"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Markdown Content
            </label>
            <ReactQuill
              value={formData.markdownContent}
              onChange={(value) => {
                handleInputChange("markdownContent", value);
              }}
              theme="snow"
              modules={modules}
              formats={formats}
              placeholder={"Write something awesome..."}
            />
          </div>

          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            Submit
          </button>
        </form>
      </div>

      <div className="w-2/4 px-8">
        <h2 className="text-4xl font-extrabold">Form Preview</h2>
        <br />
        <p className="text-2xl text-gray-900 mb-4">Title: {formData.title}</p>
        <p className="text-2xl text-gray-900 mb-4">
          Description: {formData.description}
        </p>
        <p className="text-2xl text-gray-900 mb-4">
          Company: {formData.company}
        </p>
        <p className="text-2xl text-gray-900 mb-4">
          Company URL: {formData.company_url}
        </p>
        <p className="text-2xl text-gray-900 mb-4">
          Proteins:{" "}
          {formData.proteins.map((protein, index) => (
            <span key={protein} className="capitalize mr-2">
              {protein}
              {index < formData.proteins.length - 1 && ","}
            </span>
          ))}
        </p>
        <p className="text-2xl text-gray-900 mb-4">
          Products:{" "}
          {formData.products.map((product, index) => (
            <span key={product} className="capitalize mr-2">
              {product}
              {index < formData.products.length - 1 && ","}
            </span>
          ))}
        </p>
        <p className="text-2xl text-gray-900 mb-4">
          Topics:{" "}
          {formData.topics.map((topic, index) => (
            <span key={topic} className="capitalize mr-2">
              {topic}
              {index < formData.topics.length - 1 && ","}
            </span>
          ))}
        </p>
        <p className="text-2xl text-gray-900 mb-4">
          Regions:{" "}
          {formData.regions.map((region, index) => (
            <span key={region} className="capitalize mr-2">
              {region}
              {index < formData.regions.length - 1 && ","}
            </span>
          ))}
        </p>
        <p className="text-2xl text-gray-900 mb-4">
          Flags:{" "}
          {formData.flags.map((flag, index) => (
            <span key={flag} className="capitalize mr-2">
              {flag}
              {index < formData.flags.length - 1 && ","}
            </span>
          ))}
        </p>
        <p className="text-2xl text-gray-900 mb-4">
          Directorys:{" "}
          {formData.directorys.map((directory, index) => (
            <span key={directory} className="capitalize mr-2">
              {directory}
              {index < formData.directorys.length - 1 && ","}
            </span>
          ))}
        </p>
        <p className="text-2xl text-gray-900 mb-4">
          Images URL: {formData.images}
        </p>
        <p className="text-2xl text-gray-900 mb-4">
          Featured Image URL: {formData.featured_image}
        </p>
        <p className="text-2xl text-gray-900 mb-4">
          Additional Images URL: {formData.additional_images}
        </p>
        <div className="text-2xl text-gray-900 mb-4">
          <span className="block underline">Markdown Content:</span>
          <div
            dangerouslySetInnerHTML={{ __html: formData.markdownContent }}
          ></div>
        </div>
      </div>
    </section>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
